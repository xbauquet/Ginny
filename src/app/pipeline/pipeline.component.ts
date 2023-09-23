import {Component, ElementRef, ViewChild} from '@angular/core';
import uniqolor from "uniqolor";
import Drawflow, {DrawflowNode} from "drawflow";
import {PipelineHtmlBuilder} from "./pipeline-html.builder";
import {RepoRun} from "../github-api/repo.run";
import {GithubApiService} from "../github-api/github-api.service";
import {RepositoryObserverService} from "../github-api/repository-observer.service";
import {PipelineData} from "./pipeline-data.model";
import {Repository} from "../github-api/repository.model";
import {Workflow} from "../github-api/workflow.model";
import {Utils} from "../utils";
import {RunnerService} from "./runner.service";
import {UserService, Workspace} from "../user/user.service";
import {Pipeline} from "./pipeline.model";

@Component({
  selector: 'app-pipeline',
  templateUrl: './pipeline.component.html',
  styleUrls: ['./pipeline.component.scss']
})
export class PipelineComponent {
  protected readonly Object = Object;

  selectedPipeline?: Pipeline;
  pipelines: Pipeline[] = [];
  isEditable = false;
  isSaved = true;

  selectedNode?: DrawflowNode;

  @ViewChild('drawflow') elementRef!: ElementRef<HTMLElement>;

  private editor?: Drawflow;
  private htmlBuilder = new PipelineHtmlBuilder();
  runRepos: RepoRun[] = [];
  selectedWorkspace?: Workspace;
  showCreatePipeline = false;

  constructor(private githubApiService: GithubApiService,
              private repositoryObserverService: RepositoryObserverService,
              private userService: UserService) {
    this.repositoryObserverService.runRepos.subscribe(r => this.runRepos = r);
  }

  ngAfterViewInit() {
    this.editor = new Drawflow(this.elementRef.nativeElement);
    this.editor.start();
    this.editor.editor_mode = 'view'
    this.editor.on("addReroute", () => this.isSaved = false);
    this.editor.on("connectionCreated", () => this.isSaved = false);
    this.editor.on("connectionRemoved", () => this.isSaved = false);
    this.editor.on("nodeCreated", () => this.isSaved = false);
    this.editor.on("nodeRemoved", () => this.isSaved = false);
    this.editor.on("nodeMoved", () => this.isSaved = false);
    this.editor.on("removeReroute", () => this.isSaved = false);

    this.userService.workspace.subscribe(w => {
      if (w) {
        this.onNewPipeline(w.pipelines);
      }
      this.selectedWorkspace = w;
    });
  }

  private onNewPipeline(pipelines: Pipeline[]) {
    this.pipelines = pipelines;
    const pipeline = this.pipelines.find(p => p.name === this.selectedPipeline?.name);
    pipeline ? this.setSelectedPipeline(pipeline) : this.setSelectedPipeline(this.pipelines[0]);
  }

  createPipeline(name: string) {
    this.userService.savePipeline(new Pipeline(name));
  }

  deletePipeline() {
    if (this.selectedPipeline) {
      this.userService.removePipeline(this.selectedPipeline);
    }
  }

  toggleEditPipeline() {
    this.setIsEditable(!this.isEditable);
  }

  getPipelineColor(name?: string): string {
    return name ? uniqolor(name).color : '#4e525d';
  }

  setIsEditable(isEditable: boolean) {
    this.isEditable = isEditable;
    if (this.editor) {
      if (this.isEditable) {
        this.editor.editor_mode = 'edit';
      } else {
        this.editor.editor_mode = 'view'
        if (this.selectedPipeline && this.selectedPipeline.pipeline) {
          this.editor.import(this.selectedPipeline.pipeline);
        }
      }
    }
    this.htmlBuilder.resetPipelineColor();
  }

  setSelectedPipeline(pipeline: Pipeline | undefined) {
    this.selectedPipeline = pipeline;
    this.showCreatePipeline = false;
    if (this.editor && this.selectedPipeline && this.selectedPipeline.pipeline) {
      this.editor.import(this.selectedPipeline.pipeline);
    } else if (this.editor && !this.selectedPipeline) {
      this.editor.clear();
    }
  }

  savePipeline() {
    if (this.editor && this.selectedPipeline) {
      this.selectedPipeline.pipeline = this.editor.export();
      this.userService.savePipeline(this.selectedPipeline);
      this.isSaved = true;
    }
  }

  add(data: PipelineData) {
    if (this.editor) {
      const title = data.repo.owner + " / " + data.repo.name;
      const html = this.htmlBuilder.getHTML(title, data.workflow.name, data.inputs, data.branches);
      this.editor.addNode(title, 1, 2, 20, 20, data.stepUUID, data, html, false);
    }
  }

  async addStep(repo: Repository, workflow: Workflow) {
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

    const data = new PipelineData(
      Utils.randomUUID(),
      repo,
      workflow,
      branches ?? [],
      inputs
    );
    this.add(data);
  }

  runPipeline() {
    this.selectedNode = undefined;

    if (!this.selectedPipeline || !this.selectedPipeline.pipeline) {
      return;
    }

    this.htmlBuilder.resetPipelineColor();

    const runner = new RunnerService(this.githubApiService);
    runner
      .on("stepStarted", id => this.htmlBuilder.onStepStarted(id))
      .on("stepSucceeded", id => this.htmlBuilder.onStepSuccess(id))
      .on("stepFailed", id => this.htmlBuilder.onStepFailed(id))
      .on("nextStep", (stepInId, stepOutId) =>
        this.htmlBuilder.colorConnection(stepInId, stepOutId))
      .on("pipelineMalformed", e => console.log('pipelineMalformed', e))
      .on("done", () => {
      })
      .run(this.selectedPipeline.pipeline)
      .catch(console.error);
  }

  showPipelineCreation() {
    this.setSelectedPipeline(undefined);
    this.showCreatePipeline = true;
  }
}
