import {DrawflowExport, DrawflowNode} from "drawflow";
import EventEmitter from "eventemitter3";
import {GithubApiService} from "../github-api.service";
import {Run} from "../runs/run.model";
import {Data} from "./pipeline/pipeline.component";

export declare interface RunnerService {
  on(event: 'stepStarted', listener: (stepId: string) => void): this;

  on(event: 'stepSucceeded', listener: (stepId: string) => void): this;

  on(event: 'stepFailed', listener: (stepId: string) => void): this;

  on(event: 'nextStep', listener: (stepInId: number, stepOutId: number) => void): this;

  on(event: 'pipelineMalformed', listener: (error: Error) => void): this;

  on(event: 'error', listener: (error: Error) => void): this;

  on(event: 'done', listener: (isSuccessful: boolean) => void): this;
}

export class RunnerService extends EventEmitter {

  private lock = false;

  constructor(private apiService: GithubApiService) {
    super();
  }

  public async run(pipeline: DrawflowExport | undefined) {
    if (this.lock) {
      console.error("Runner is locker. Run method can only be called once.");
    }
    if (this.pipelineChecks(pipeline)) {
      this.lock = true;
      const steps = Object.values(pipeline!.drawflow.Home.data);
      // The first step is the one with no connection coming to its input
      const firstStep = steps.find(step => step.inputs["input_1"].connections.length === 0);
      if (!firstStep) {
        this.onError(new Error("No first step found"));
        return;
      }
      const result = await this.processStep(firstStep, steps);
      this.onDone(result);
    }
  }

  private async processStep(step: DrawflowNode, steps: DrawflowNode[]): Promise<boolean> {
    this.onStepStarted(step.class);
    const data = step.data as Data;
    const input: any = {};
    for (let i of Object.values(data.inputs) as any[]) {
      input[i.key] = i.value;
    }
    await this.apiService.runWorkflow(data.repo, data.workflow, data.branch, input);
    const runResult = await this.waitForWorkflowCompletion(data.repo.owner, data.repo.name, data.workflow.id);
    if (runResult.conclusion !== "success") {
      this.onStepFailed(step.class);
    } else {
      this.onStepSucceeded(step.class);
    }
    const stepResult = runResult.conclusion === "success";
    let next: DrawflowNode | undefined;
    if (stepResult) {
      next = this.getNextStep(step, steps, 'output_1');
    } else {
      next = this.getNextStep(step, steps, 'output_2');
    }
    if (next) {
      this.onNextStep(next.id, step.id);
      return this.processStep(next, steps);
    } else {
      return Promise.resolve(stepResult);
    }
  }

  /**
   * This only considers on connection coming out of the output. If several connections are out of this output only
   * the first one created will be run.
   * TODO handle multiple connections
   */
  private getNextStep(step: DrawflowNode, steps: DrawflowNode[], outputId: string) {
    if (step.outputs[outputId].connections.length > 0) {
      const nextStepId = Number(step.outputs[outputId].connections[0].node);
      return steps.find(step => step.id === nextStepId);
    } else {
      return undefined;
    }
  }

  private pipelineChecks(pipeline: DrawflowExport | undefined) {
    if (!pipeline) {
      console.error("Pipeline is undefined");
      return false;
    }
    const steps = Object.values(pipeline.drawflow.Home.data);

    let startingSteps = 0;

    for (let step of steps) {
      if (step.inputs["input_1"].connections.length === 0) {
        startingSteps = startingSteps + 1;
      }
    }

    if (startingSteps > 1) {
      console.error("More than one starting point");
      return false
    }

    if (startingSteps < 1) {
      console.error("No starting point");
      return false
    }

    return true;
  }

  private async waitForWorkflowCompletion(owner: string, repo: string, workflowId: string): Promise<Run> {
    const run = await this.apiService.listWorkflowRuns(owner, repo, workflowId, 1);
    if (run[0].status !== 'completed') {
      await this.wait(5000);
      return this.waitForWorkflowCompletion(owner, repo, workflowId);
    } else {
      return run[0];
    }
  }

  private wait(milliSeconds: number) {
    return new Promise<void>(resolve => setTimeout(() => resolve(), milliSeconds));
  }

  private onStepStarted(stepId: string) {
    this.emit('stepStarted', stepId);
  }

  private onStepSucceeded(stepId: string) {
    this.emit('stepSucceeded', stepId);
  }

  private onNextStep(stepInId: number, stepOutId: number) {
    this.emit('nextStep', stepInId, stepOutId);
  }

  private onStepFailed(stepId: string) {
    this.emit('stepFailed', stepId);
  }

  private onPipelineMalformed(error: Error) {
    this.emit('stepFailed', error);
    this.emit('done', false);
  }

  private onError(error: Error) {
    this.emit('error', error);
    this.emit('done', false);
  }

  private onDone(isSuccessful: boolean) {
    this.emit('done', isSuccessful);
  }
}
