import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {GithubApiService} from "../../github-api.service";
import Drawflow from "drawflow";
import {Pipeline} from "../pipeline.model";
import {PipelineHtmlBuilder} from "../pipeline-html.builder";
import {RunnerService} from "../runner.service";
import {Utils} from "../../../utils";
import {Repository} from "../../repository.model";
import {Workflow} from "../../runs/workflow.model";
import {PipelineService} from "../pipeline.service";
import {WorkspaceService} from "../../workspace/workspace.service";
import {Workspace} from "../../workspace/workspace.model";
import {RepositoryObserverService} from "../../runs/repository-observer.service";
import {RepoRun} from "../../runs/repo.run";

@Component({
  selector: 'app-pipeline',
  templateUrl: './pipeline.component.html',
  styleUrls: ['./pipeline.component.scss']
})
export class PipelineComponent implements AfterViewInit {

  @ViewChild('drawflow') elementRef!: ElementRef<HTMLElement>;

  private editor?: Drawflow;
  private htmlBuilder = new PipelineHtmlBuilder();

  isSaved = true;
  isEditable = false;

  workspace?: Workspace;

  selectedPipeline?: Pipeline;
  pipelines: Pipeline[] = [];
  runRepos: RepoRun[] = [];

  constructor(private githubApiService: GithubApiService,
              private pipelineService: PipelineService,
              private workspaceService: WorkspaceService,
              private repositoryObserverService: RepositoryObserverService) {
    this.workspaceService.workspace.subscribe(w => this.workspace = w);
    this.repositoryObserverService.runRepos.subscribe(r => this.runRepos = r);
  }

  ngAfterViewInit() {
    this.editor = new Drawflow(this.elementRef.nativeElement);
    this.editor.start();
    this.editor.editor_mode = 'fixed'

    this.editor.on("addReroute", () => this.isSaved = false);
    this.editor.on("connectionCreated", () => this.isSaved = false);
    this.editor.on("connectionRemoved", () => this.isSaved = false);
    this.editor.on("nodeCreated", () => this.isSaved = false);
    this.editor.on("nodeRemoved", () => this.isSaved = false);
    this.editor.on("nodeMoved", () => this.isSaved = false);
    this.editor.on("removeReroute", () => this.isSaved = false);

    this.pipelineService.pipelines.subscribe(v => {
      this.pipelines = v;
      const pipe = this.pipelines.find(p => p.name === this.selectedPipeline?.name);
      if (pipe) {
        this.selectedPipeline = pipe;
      } else {
        this.selectedPipeline = this.pipelines[0];
      }

      if (this.editor && this.selectedPipeline && this.selectedPipeline.pipeline) {
        this.editor.import(this.selectedPipeline.pipeline);
        if (this.isEditable) {
          this.htmlBuilder.setEditionColors(this.selectedPipeline);
        } else {
          this.htmlBuilder.setStaticColors(this.selectedPipeline);
        }
      } else if (this.editor && !this.selectedPipeline) {
        this.editor.clear();
      }
    });
  }

  setSelectedPipeline(pipeline: Pipeline) {
    this.selectedPipeline = pipeline;
    if (this.editor && this.selectedPipeline && this.selectedPipeline.pipeline) {
      this.editor.import(this.selectedPipeline.pipeline);
      this.htmlBuilder.setStaticColors(this.selectedPipeline);
    } else if (this.editor && this.selectedPipeline) {
      this.editor.clear();
    }
  }

  savePipeline() {
    if (this.editor && this.selectedPipeline) {
      this.selectedPipeline.pipeline = this.editor.export();
      this.pipelineService.updatePipeline(this.selectedPipeline);
      this.isSaved = true;
    }
  }

  add(data: Data) {
    if (this.editor) {
      const title = data.repo.owner + "/" + data.repo.name;
      const html = this.htmlBuilder.getHTML(title, data.workflow.name, data.inputs, data.branches);
      this.editor.addNode(title, 1, 2, 0, 0, data.stepUUID, data, html, false);
    }
  }

  run() {
    if (!this.selectedPipeline || !this.selectedPipeline.pipeline) {
      return;
    }
    const steps = Object.values(this.selectedPipeline.pipeline.drawflow.Home.data);
    steps.forEach(step => {
      this.htmlBuilder.addClassToSuccessOutput(step.class, "white-dot");
      this.htmlBuilder.addClassToFailureOutput(step.class, "white-dot");
    });

    const runner = new RunnerService(this.githubApiService);
    runner
      .on("stepStarted", id => {
        this.htmlBuilder.addClassToSuccessOutput(id, "yellow-dot");
        this.htmlBuilder.addClassToFailureOutput(id, "yellow-dot");
      })
      .on("stepSucceeded", id => {
        this.htmlBuilder.removeClassFromSuccessOutput(id, "yellow-dot");
        this.htmlBuilder.removeClassFromFailureOutput(id, "yellow-dot");
        this.htmlBuilder.removeClassFromSuccessOutput(id, "white-dot");
        this.htmlBuilder.titleSuccess(id);
      })
      .on("stepFailed", id => {
        this.htmlBuilder.removeClassFromSuccessOutput(id, "yellow-dot");
        this.htmlBuilder.removeClassFromFailureOutput(id, "yellow-dot");
        this.htmlBuilder.removeClassFromFailureOutput(id, "white-dot");
      })
      .on("nextStep", (stepInId, stepOutId) => {
        this.htmlBuilder.colorConnection(stepInId, stepOutId);
      })
      .on("pipelineMalformed", e => console.log('pipelineMalformed', e))
      .on("done", () => {
      })
      .run(this.selectedPipeline.pipeline);
  }

  toggleEdit() {
    if (this.editor) {
      if (this.editor.editor_mode === 'fixed') {
        this.editor.editor_mode = 'edit';
        this.isEditable = true;
        this.htmlBuilder.setEditionColors(this.selectedPipeline!);
      } else {
        this.editor.editor_mode = 'fixed'
        this.isEditable = false;
        if (this.selectedPipeline) {
          this.editor.import(this.selectedPipeline.pipeline);
        }
        this.htmlBuilder.setStaticColors(this.selectedPipeline!);
      }
    }
  }

  async addStep(repo: Repository, workflow: Workflow) {
    // this.stepAddingParams = {repo, workflow};
    const branches = await this.githubApiService.listBranchNames(repo);
    const inputs: any = {};
    for (let input of workflow.inputs) {
      inputs[input.key] = {
        key: input.key,
        value: input.defaultValue,
        type: input.type,
        options: input.options,
        description: input.description
      };
    }

    const data = new Data(
      Utils.randomUUID(),
      repo,
      workflow,
      branches ?? [],
      inputs
    );
    this.add(data);
  }

  createNewWorkflow(value: string) {
    const pipeline = new Pipeline(value);
    this.pipelineService.addPipeline(pipeline);
    this.setSelectedPipeline(pipeline);
  }

  deletePipeline() {
    if (this.selectedPipeline) {
      const p = this.selectedPipeline;
      this.selectedPipeline = undefined;
      this.pipelineService.removePipeline(p);
    }
  }
}

export class Data {
  constructor(public stepUUID: string,
              public repo: Repository,
              public workflow: Workflow,
              public branches: string[] = [],
              public inputs: any,
              public branch: string = 'main') {
  }
}
