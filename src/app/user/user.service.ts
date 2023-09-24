import {Injectable} from '@angular/core';
import {Octokit} from "@octokit/rest";
import {BehaviorSubject} from "rxjs";
import {Repository} from "../github-api/repository.model";
import {Pipeline} from "../pipeline/pipeline.model";
import {Octokit as Core} from "@octokit/core";
import {PaginateInterface} from "@octokit/plugin-paginate-rest";
import {RestEndpointMethods} from "@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types";
import {Api} from "@octokit/plugin-rest-endpoint-methods/dist-types/types";

export type OctokitType = Core & { paginate: PaginateInterface } & RestEndpointMethods & Api;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user = new BehaviorSubject<User | undefined>(undefined)
  workspace = new BehaviorSubject<Workspace | undefined>(undefined);
  octokit = new BehaviorSubject<OctokitType | undefined>(undefined);
  isReady = new BehaviorSubject(false);

  constructor() {
    const token = this.getToken();
    if (token) {
      this.login(token)
        .catch(console.error);
    } else {
      this.logout();
    }
  }

  /*****************************************
   * Authentication
   *****************************************/
  async login(token: string) {
    const octokit = new Octokit({auth: token});
    try {
      const result = await octokit.rest.users.getAuthenticated();
      const user = new User();
      user.name = result.data.name || "";
      user.login = result.data.login || "";
      user.email = result.data.email || "";
      user.avatar_url = result.data.avatar_url || "";
      user.html_url = result.data.html_url || "";
      user.workspaces = this.getWorkspaces(user.login);
      this.saveToken(token);
      this.octokit.next(octokit);
      if (user.workspaces.length > 0) {
        this.workspace.next(user.workspaces[0]);
      }
      this.user.next(user);
    } catch (e) {
      this.octokit.next(undefined);
      this.user.next(undefined);
      return Promise.reject();
    }
    this.isReady.next(true);
  }

  logout() {
    this.deleteToken();
    this.octokit.next(undefined);
    this.user.next(undefined);
    this.isReady.next(true);
  }

  /*****************************************
   * Workspace management
   *****************************************/
  addWorkspace(workspace: Workspace) {
    if (!this.user.value) {
      console.warn("User is undefined");
      return;
    }
    this.user.value.workspaces.push(workspace);
    this.workspace.next(this.user.value.workspaces[this.user.value.workspaces.length - 1]);
    this.save();
  }

  deleteCurrentWorkspace() {
    if (!this.user.value || !this.workspace.value) {
      console.warn("User or Workspace is undefined");
      return;
    }
    const index = this.user.value.workspaces.indexOf(this.workspace.value);
    this.user.value.workspaces.splice(index, 1);
    this.user.value.workspaces.length > 0 ? this.workspace.next(this.user.value.workspaces[0]) : this.workspace.next(undefined);
    this.save();
  }

  selectWorkspace(workspace: Workspace) {
    this.workspace.next(workspace);
  }

  addRepositoryToWorkspace(repository: Repository): void {
    if (!this.workspace.value) {
      console.warn("Workspace is undefined");
      return;
    }
    this.workspace.value.repos.push(repository);
    this.save();
   // this.workspace.next(this.workspace.value);
  }

  removeRepositoryFromWorkspace(repository: Repository): void {
    if (!this.workspace.value) {
      return;
    }
    const index = this.workspace.value.repos.indexOf(repository);
    this.workspace.value.repos.splice(index, 1);
    this.save();
    this.workspace.next(this.workspace.value);
  }

  /*****************************************
   * Pipeline management
   *****************************************/
  savePipeline(pipeline: Pipeline) {
    if (!this.workspace.value) {
      console.warn("Workspace is undefined");
      return;
    }
    const index = this.workspace.value.pipelines.indexOf((p: Pipeline) => p.name === pipeline.name);
    if (index) {
      this.workspace.value.pipelines.splice(index, 1);
    }
    this.workspace.value.pipelines.push(pipeline);
    this.save();
  }

  removePipeline(pipeline: Pipeline) {
    if (!this.workspace.value) {
      console.warn("Workspace is undefined");
      return;
    }
    const index = this.workspace.value.pipelines.indexOf((p: Pipeline) => p.name === pipeline.name);
    if (index) {
      this.workspace.value.pipelines.splice(index, 1);
    }
    this.save();
  }

  /*****************************************
   * Storage
   *****************************************/
  private getWorkspaces(userLogin: string) {
    const w = localStorage.getItem(this.storageKey(userLogin));
    return w ? JSON.parse(w) : [];
  }

  private save() {
    if (this.user.value) {
      localStorage.setItem(this.storageKey(this.user.value.login), JSON.stringify(this.user.value.workspaces));
      this.workspace.next(this.workspace.value);
      this.user.next(this.user.value);
    } else {
      console.warn("User is undefined");
    }
  }

  private storageKey(userLogin: string) {
    return "ginny-workspaces-" + userLogin;
  }

  private getToken() {
    return localStorage.getItem("ginny-token");
  }

  private saveToken(token: string) {
    localStorage.setItem("ginny-token", token);
  }

  private deleteToken() {
    localStorage.removeItem("ginny-token");
  }
}

export class Workspace {
  constructor(public readonly name: string,
              public repos: Repository[] = [],
              public pipelines: Pipeline[] = []) {
  }
}

export class User {
  public name = "";
  public login = "";
  public email = "";
  public avatar_url = "";
  public html_url = "";
  public workspaces: Workspace[] = [];
}
