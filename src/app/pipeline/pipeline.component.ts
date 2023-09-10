import {Component, ElementRef, ViewChild} from '@angular/core';
import uniqolor from "uniqolor";
import {Pipeline} from "./pipeline.model";
import Drawflow, {DrawflowNode} from "drawflow";
import {RepoRun} from "../ci-cd/repo.run";
import {Workspace} from "../workspace/workspace.model";
import {PipelineService} from "./pipeline.service";
import {GithubApiService} from "../github-api.service";
import {WorkspaceService} from "../workspace/workspace.service";
import {MatDialog} from "@angular/material/dialog";
import {RepositoryObserverService} from "../ci-cd/repository-observer.service";
import {PipelineData} from "./pipeline-data.model";
import {Repository} from "../repository.model";
import {Workflow} from "../ci-cd/workflow.model";
import {Utils} from "../../utils";
import {RunnerService} from "./runner.service";
import {PipelineHtmlBuilder} from "./pipeline-html.builder";
import {CreatePipelineComponent} from "./create-pipeline/create-pipeline.component";

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
  selectedWorkspace: Workspace | undefined;

  constructor(private pipelineService: PipelineService,
              private githubApiService: GithubApiService,
              private repositoryObserverService: RepositoryObserverService,
              private workspaceService: WorkspaceService,
              private dialog: MatDialog) {
    this.workspaceService.workspace.subscribe(w => this.selectedWorkspace = w);
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

    this.pipelineService.pipelines.subscribe(v => {
      this.pipelines = v;
      const pipe = this.pipelines.find(p => p.name === this.selectedPipeline?.name);
      if (pipe) {
        this.selectPipeline(pipe);
      } else {
        this.selectPipeline(this.pipelines[0]);
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

      this.registerClickEvents();
    });
  }

  createPipeline() {
    this.dialog.open(CreatePipelineComponent, CreatePipelineComponent.config)
      .afterClosed()
      .subscribe(value => {
        if (value) {
          const pipeline = new Pipeline(value.name);
          this.pipelineService.addPipeline(pipeline);
          this.selectPipeline(pipeline);
        }
      });
  }

  getPipelineColor(name?: string): string {
    return name ? uniqolor(name).color : '#4e525d';
  }

  deletePipeline() {
    if (this.selectedPipeline) {
      this.pipelineService.removePipeline(this.selectedPipeline);
      this.selectedPipeline = this.pipelines.length > 0 ? this.pipelines[0] : undefined;
    }
  }

  toggleEditPipeline() {
    this.setIsEditable(!this.isEditable);
  }

  selectPipeline(pipeline?: Pipeline) {
    this.selectedPipeline = pipeline;
  }

  setIsEditable(isEditable: boolean) {
    this.isEditable = isEditable;
    if (this.editor) {
      if (this.isEditable) {
        this.editor.editor_mode = 'edit';
        if (this.selectedPipeline && this.selectedPipeline.pipeline) {
          this.htmlBuilder.setEditionColors(this.selectedPipeline);
        }
      } else {
        this.editor.editor_mode = 'view'
        if (this.selectedPipeline && this.selectedPipeline.pipeline) {
          this.editor.import(this.selectedPipeline.pipeline);
        }
        this.htmlBuilder.setStaticColors(this.selectedPipeline!);
        this.registerClickEvents();
      }
    }
  }

  setSelectedPipeline(pipeline: Pipeline) {
    this.selectedPipeline = pipeline;
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
  }

  savePipeline() {
    if (this.editor && this.selectedPipeline) {
      this.selectedPipeline.pipeline = this.editor.export();
      this.pipelineService.updatePipeline(this.selectedPipeline);
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

    const data = new PipelineData(
      Utils.randomUUID(),
      repo,
      workflow,
      branches ?? [],
      inputs
    );
    this.add(data);
  }

  private registerClickEvents() {
    if (this.editor && this.editor.editor_mode != "edit") {
      for (let n of Object.values(this.editor!.export().drawflow.Home.data)) {
        const node = this.editor.getNodeFromId(n.id);
        document.getElementsByClassName(node.data.stepUUID)[0].addEventListener("click", () => {
          this.selectedNode = this.selectedNode !== node ? node : undefined;
        });
      }
    }
  }

  runPipeline() {
    this.selectedNode = undefined;


    console.log(this.selectedPipeline?.pipeline?.drawflow.Home.data);


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

  setValue(event: any, key: string) {
    if (this.selectedNode && this.editor) {
      const data = this.editor.getNodeFromId(this.selectedNode.id).data;
      data.inputs[key].value = event.target.value;
      this.editor.updateNodeDataFromId(this.selectedNode.id, data);
      this.savePipeline();
    }
  }

  setBranch(event: any) {
    if (this.selectedNode && this.editor) {
      const data = this.editor.getNodeFromId(this.selectedNode.id).data;
      data.branch = event.target.value;
      this.editor.updateNodeDataFromId(this.selectedNode.id, data);
      this.savePipeline();
    }
  }

  closeStepInputMenu() {
    this.selectedNode = undefined;
  }
}
