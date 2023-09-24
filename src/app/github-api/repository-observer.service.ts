import {HostListener, Injectable} from '@angular/core';
import {Workflow} from "./workflow.model";
import {Run} from "./run.model";
import {GithubApiService} from "./github-api.service";
import {BehaviorSubject, interval, Subscription} from "rxjs";
import {RepoRun} from "./repo.run";
import {UserService, Workspace} from "../user/user.service";

@Injectable({
  providedIn: 'root'
})
export class RepositoryObserverService {

  runRepos = new BehaviorSubject<RepoRun[]>([]);

  private workspace?: Workspace;
  isRefreshing = new BehaviorSubject(false);
  private refreshFrequency = 30000;
  private wasRefreshing = false;
  private scheduler?: Subscription;
  private frequencyKey = "refreshFrequency";

  constructor(private userService: UserService,
              private githubApiService: GithubApiService) {
    this.userService.workspace.subscribe(w => {
      this.initFrequency();
      this.workspace = w;
      this.runRepos.next([]);
      this.refreshOnce().catch(e => console.error(e));
    });
  }

  get frequency() {
    return this.refreshFrequency;
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
    this.isRefreshing.next(true);
    this.wasRefreshing = true;
    this.refreshOnce().catch(e => console.error(e));
    this.scheduler = interval(this.refreshFrequency)
      .subscribe(_ => this.refreshOnce().catch(e => console.error(e)));
  }

  pause(): void {
    this.isRefreshing.next(false);
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
        this.isRefreshing.next(false);
        this.wasRefreshing = true;
      }
    } else {
      if (this.wasRefreshing) {
        this.isRefreshing.next(true);
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

