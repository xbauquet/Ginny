import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Workspace} from "./workspace.model";

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  hasPrevious = new BehaviorSubject(false);
  hasNext = new BehaviorSubject(false);
  workspace = new BehaviorSubject<Workspace | undefined>(undefined);

  private workspaceStorageKey = "ginny-workspaces";
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
