import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Workspace} from "./workspace.model";
import {Repository} from "../../github-api/repository.model";

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  hasPrevious = new BehaviorSubject(false);
  hasNext = new BehaviorSubject(false);
  workspace = new BehaviorSubject<Workspace | undefined>(undefined);

  private readonly workspaceStorageKey = "ginny-workspaces";
  private workspaces: Workspace[] = [];

  constructor() {
    this.getWorkspaces();
  }

  add(workspace: Workspace) {
    this.workspaces.push(workspace);
    this.setWorkspace(this.workspaces.length - 1);
    this.saveWorkspaces();
  }

  delete() {
    if (this.workspace.value) {
      const index = this.workspaces.indexOf(this.workspace.value);
      this.workspaces.splice(index, 1);
      if (this.hasPrevious.value) {
        this.previous();
      } else if (this.hasNext.value) {
        this.next();
      } else {
        this.setWorkspace(undefined);
      }
      this.saveWorkspaces();
    }
  }

  previous() {
    if (this.hasPrevious.value && this.workspace.value) {
      const index = this.workspaces.indexOf(this.workspace.value);
      this.setWorkspace(index - 1);
    }
  }

  next() {
    if (this.hasNext.value && this.workspace.value) {
      const index = this.workspaces.indexOf(this.workspace.value);
      this.setWorkspace(index + 1);
    }
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
      this.setWorkspace(0);
    } else {
      this.workspaces = [];
      this.setWorkspace(undefined);
    }
  }

  private setWorkspace(index: number | undefined) {
    if (index === undefined) {
      this.hasNext.next(false);
      this.hasPrevious.next(false);
      this.workspace.next(undefined);
    }

    if (index !== undefined && index >= 0 && index < this.workspaces.length) {
      this.workspace.next(this.workspaces[index]);
      this.hasNext.next(index + 1 < this.workspaces.length);
      this.hasPrevious.next(index - 1 >= 0);
    }
  }
}
