import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Workspace} from "./workspace.model";
import {Repository} from "../github-api/repository.model";

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  workspace = new BehaviorSubject<Workspace | undefined>(undefined);
  workspaces: Workspace[] = [];

  private readonly workspaceStorageKey = "ginny-workspaces";

  constructor() {
    this.getWorkspaces();
  }

  add(workspace: Workspace) {
    this.workspaces.push(workspace);
    this.selectWorkspace(this.workspaces[this.workspaces.length - 1]);
    this.saveWorkspaces();
  }

  delete() {
    if (this.workspace.value) {
      const index = this.workspaces.indexOf(this.workspace.value);
      this.workspaces.splice(index, 1);
      if (this.workspaces.length > 0) {
        this.selectWorkspace(this.workspaces[0]);
      } else {
        this.selectWorkspace(undefined);
      }
      this.saveWorkspaces();
    }
  }

  selectWorkspace(workspace: Workspace | undefined) {
    this.workspace.next(workspace);
  }

  addRepositoryToWorkspace(repository: Repository): void {
    if (!this.workspace.value) {
      return;
    }
    this.workspace.value.repos.push(repository);
    this.saveWorkspaces();
    this.workspace.next(this.workspace.value);
  }

  removeRepositoryFromWorkspace(repository: Repository): void {
    if (!this.workspace.value) {
      return;
    }
    const index = this.workspace.value.repos.indexOf(repository);
    this.workspace.value.repos.splice(index, 1);
    this.saveWorkspaces();
    this.workspace.next(this.workspace.value);
  }

  private saveWorkspaces() {
    localStorage.setItem(this.workspaceStorageKey, JSON.stringify(this.workspaces));
  }

  private getWorkspaces() {
    const w = localStorage.getItem(this.workspaceStorageKey);
    if (w) {
      this.workspaces = JSON.parse(w);
      this.selectWorkspace(this.workspaces[0]);
    } else {
      this.workspaces = [];
      this.selectWorkspace(undefined);
    }
  }
}
