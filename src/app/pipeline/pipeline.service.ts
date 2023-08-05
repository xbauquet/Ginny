import {Injectable} from '@angular/core';
import {Pipeline} from "./pipeline.model";
import {Workspace} from "../workspace/workspace.model";
import {WorkspaceService} from "../workspace/workspace.service";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PipelineService {

  private workspace?: Workspace;
  private readonly pipelinesKey = "ginny-pipelines";
  pipelines = new BehaviorSubject<Pipeline[]>([]);

  constructor(private workspaceService: WorkspaceService) {
    this.workspaceService.workspace.subscribe(w => {
      this.workspace = w;
      this.pipelines.next(this.getPipelines().get(this.workspace!.name) || []);
    });
  }

  updatePipeline(pipeline: Pipeline) {
    if (!this.workspace) {
      console.warn("Workspace is undefined.");
      return;
    }
    const pipelines = this.getPipelines();
    const index = pipelines
      .get(this.workspace.name)!
      .findIndex(p => p.name === pipeline.name);
    if (index >= 0) {
      pipelines
        .get(this.workspace.name)!
        .splice(index, 1);
    }
    pipelines.get(this.workspace.name)!.push(pipeline);
    this.savePipelines(pipelines);
  }

  addPipeline(pipeline: Pipeline) {
    if (!this.workspace) {
      console.warn("Workspace is undefined.");
      return;
    }

    const pipelines = this.getPipelines();
    if (!pipelines.get(this.workspace.name)) { // TODO
      console.warn("No pipeline found for workspace : " + this.workspace.name);
      return;
    }
    pipelines.get(this.workspace.name)!.push(pipeline);
    this.savePipelines(pipelines);
  }

  removePipeline(pipeline: Pipeline) {
    if (!this.workspace) {
      console.warn("Workspace is undefined.");
      return;
    }
    const pipelines = this.getPipelines();
    const index = pipelines
      .get(this.workspace.name)!
      .findIndex(p => p.name === pipeline.name);
    if (index >= 0) {
      pipelines
        .get(this.workspace.name)!
        .splice(index, 1);
    }
    this.savePipelines(pipelines);
  }

  getPipelines(): Map<string, Pipeline[]> {
    let pipelines: Map<string, Pipeline[]> = new Map();

    if (!this.workspace) {
      console.warn("Workspace is undefined.");
      return pipelines;
    }

    const pipelinesJson = localStorage.getItem(this.pipelinesKey);
    if (pipelinesJson) {
      pipelines = new Map(JSON.parse(pipelinesJson));
    }

    let pipelineForGroup = pipelines.get(this.workspace.name);
    if (!pipelineForGroup) {
      pipelines.set(this.workspace.name, []);
    }

    this.savePipelines(pipelines);
    return pipelines;
  }

  private savePipelines(pipelines: Map<string, Pipeline[]>) {
    if (!this.workspace) {
      console.warn("Workspace is undefined.");
      return;
    }
    localStorage.setItem(this.pipelinesKey, JSON.stringify(Array.from(pipelines.entries())));
    if (pipelines.get(this.workspace.name)) {
      this.pipelines.next(pipelines.get(this.workspace.name)!);
    } else {
      this.pipelines.next([]);
    }
  }
}
