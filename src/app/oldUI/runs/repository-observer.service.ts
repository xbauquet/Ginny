import {HostListener, Injectable} from '@angular/core';
import {Workflow} from "./workflow.model";
import {Run} from "./run.model";
import {Workspace} from "../../workspace/workspace.model";
import {WorkspaceService} from "../../workspace/workspace.service";
import {GithubApiService} from "../../github-api.service";
import {BehaviorSubject, interval, Subscription} from "rxjs";
import {RepoRun} from "./repo.run";

@Injectable({
  providedIn: 'root'
})
export class RepositoryObserverService {

  runRepos = new BehaviorSubject<RepoRun[]>([]);

  private workspace?: Workspace;
  private isRefreshing = false;
  private refreshFrequency = 30000;
  private wasRefreshing = false;
  private scheduler?: Subscription;
  private frequencyKey = "refreshFrequency";

  constructor(private workspaceService: WorkspaceService,
              private githubApiService: GithubApiService) {
    this.workspaceService.workspace.subscribe(w => {
      this.initFrequency();
      this.workspace = w;
      this.runRepos.next([]);
      this.refreshOnce().catch(e => console.error(e));
    });
  }

  get frequency() {
    return this.refreshFrequency;
  }

  get refreshing(): boolean {
    return this.isRefreshing;
  }

  async refreshOnce() {
    if (this.workspace) {
      const newArray: RepoRun[] = [];
      for (let repo of this.workspace.repos) {
        const tuple: { workflow: Workflow, runs: Run[] }[] = [];
        const workflows = await this.githubApiService.listWorkflows(repo.owner, repo.name);
        for (let workflow of workflows) {
          const runs = await this.githubApiService.listWorkflowRuns(repo.owner, repo.name, workflow.id);
          tuple.push({workflow, runs});
        }
        newArray.push({repo, workflowRun: tuple});
      }
      this.runRepos.next(newArray);
    }
  }

  refresh() {
    this.isRefreshing = true;
    this.wasRefreshing = true;
    this.refreshOnce().catch(e => console.error(e));
    this.scheduler = interval(this.refreshFrequency)
      .subscribe(_ => this.refreshOnce().catch(e => console.error(e)));
  }

  pause(): void {
    this.isRefreshing = false;
    this.wasRefreshing = false;
    this.scheduler?.unsubscribe();
  }

  setFrequency(frequency: number): void {
    // if frequency < 10 seconds
    if (frequency < 10 * 1000) {
      frequency = 10 * 1000;
    }
    this.refreshFrequency = frequency;
    localStorage.setItem(this.frequencyKey, this.refreshFrequency.toString());
  }

  @HostListener('document:visibilitychange', ['$event']) visibilitychange() {
    if (document.hidden) {
      if (this.isRefreshing) {
        this.isRefreshing = false;
        this.wasRefreshing = true;
      }
    } else {
      if (this.wasRefreshing) {
        this.isRefreshing = true;
      }
    }
  }

  private initFrequency() {
    let f = localStorage.getItem(this.frequencyKey);
    if (f === null) {
      localStorage.setItem(this.frequencyKey, this.refreshFrequency.toString());
    }
    f = localStorage.getItem(this.frequencyKey);
    this.refreshFrequency = Number(f);
  }
}

