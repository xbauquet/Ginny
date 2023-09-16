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
import {GithubApiService} from "../github-api/github-api.service";
import {MatSnackBar} from "@angular/material/snack-bar";

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

  workflowRunnerData?: { repo: Repository, workflow: Workflow, branches: string[] };

  constructor(private repositoryObserverService: RepositoryObserverService,
              private workspaceService: WorkspaceService,
              private githubApiService: GithubApiService,
              private router: Router,
              private snackBar: MatSnackBar) {
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

  showWorkflowInputs(run: { workflow: Workflow; runs: Run[] }, repo: Repository) {
    this.workflowRunnerData = {
      repo,
      workflow: run.workflow,
      branches: ['main']
    }
  }

  closeWorkflowRunner() {
    this.workflowRunnerData = undefined;
  }

  runWorkflow(data: {branch: string, inputs: any}) {
    if (this.workflowRunnerData) {
      this.githubApiService
        .runWorkflow(
          this.workflowRunnerData.repo,
          this.workflowRunnerData.workflow,
          data.branch,
          data.inputs)
        .then(() => {
          this.workflowRunnerData = undefined;
          this.snackBar.open("Workflow started", undefined, {
            duration: 2000,
            panelClass: ['success-snack-bar']
          });
        })
        .catch(e => console.error(e));
    }
  }
}
