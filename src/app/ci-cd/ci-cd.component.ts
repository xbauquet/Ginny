import {Component} from '@angular/core';
import {RepoRun} from "../github-api/repo.run";
import {Workspace} from "../workspace/workspace.model";
import {RepositoryObserverService} from "../github-api/repository-observer.service";
import {WorkspaceService} from "../workspace/workspace.service";
import {Router} from "@angular/router";
import {AppRoutes} from "../appRoutes.enum";
import {Workflow} from "../github-api/workflow.model";
import {Run} from "../github-api/run.model";
import {Repository} from "../github-api/repository.model";

@Component({
  selector: 'app-ci-cd',
  templateUrl: './ci-cd.component.html',
  styleUrls: ['./ci-cd.component.scss']
})
export class CiCdComponent {
  repoRuns: RepoRun[] = [];
  selectedWorkspace?: Workspace;

  isLoading = false;
  isRefreshing = false;

  constructor(private repositoryObserverService: RepositoryObserverService,
              private workspaceService: WorkspaceService,
              private router: Router) {
    this.workspaceService.workspace.subscribe(w => {
      this.isLoading = true;
      this.selectedWorkspace = w;
    });
    this.repositoryObserverService.isRefreshing.subscribe(v => this.isRefreshing = v);
    this.repositoryObserverService.runRepos.subscribe(v => {
      this.repoRuns = v;
      this.isLoading = false;
    });
  }

  changeRepositories() {
    this.router
      .navigateByUrl(AppRoutes.WORKSPACE_REPOSITORIES)
      .catch(console.error);
  }

  deleteWorkspace() {
    this.workspaceService.delete();
  }

  refreshOnce() {
    this.repositoryObserverService.refreshOnce().catch(console.error);
  }

  toggleAutoRefresh() {
    this.isRefreshing ? this.repositoryObserverService.pause() : this.repositoryObserverService.refresh();
  }

  runWorkflow(run: { workflow: Workflow; runs: Run[] }, repo: Repository) {

  }
}
