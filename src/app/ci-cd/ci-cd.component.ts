import {Component} from '@angular/core';
import {RepoRun} from "../github-api/repo.run";
import {RepositoryObserverService} from "../github-api/repository-observer.service";
import {Router} from "@angular/router";
import {AppRoutes} from "../appRoutes.enum";
import {Workflow} from "../github-api/workflow.model";
import {Run} from "../github-api/run.model";
import {Repository} from "../github-api/repository.model";
import {GithubApiService} from "../github-api/github-api.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserService, Workspace} from "../user/user.service";

/**
 * Display results of the Github actions for the repositories included in the current workspace
 * Also allow to run a workflow that can be triggered manually (has the workflow_dispatch triggering event)
 */
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
              private userService: UserService,
              private githubApiService: GithubApiService,
              private router: Router,
              private snackBar: MatSnackBar) {
    this.userService.workspace.subscribe(w => {
      this.selectedWorkspace = w;
      this.isLoading = true;
    });
    this.repositoryObserverService.isRefreshing.subscribe(v => this.isRefreshing = v);
    this.repositoryObserverService.runRepos.subscribe(v => {
      this.repoRuns = v;
      this.isLoading = false;
    });
  }

  /*****************************************
   * Methods to run workflows
   *****************************************/
  async showWorkflowInputs(run: { workflow: Workflow; runs: Run[] }, repo: Repository) {
    this.workflowRunnerData = {
      repo,
      workflow: run.workflow,
      branches: await this.githubApiService.listBranchNames(repo)
    }
  }

  closeWorkflowRunner() {
    this.workflowRunnerData = undefined;
  }

  runWorkflow(data: { branch: string, inputs: any }) {
    if (this.workflowRunnerData) {
      this.githubApiService
        .runWorkflow(
          this.workflowRunnerData.repo,
          this.workflowRunnerData.workflow,
          data.branch,
          data.inputs)
        .then(() => {
          this.closeWorkflowRunner();
          this.snackBar.open("Workflow started", undefined, {
            duration: 2000,
            panelClass: ['success-snack-bar']
          });
        })
        .catch(console.error);
    }
  }

  /*****************************************
   * Methods for the action menu
   *****************************************/
  changeRepositories() {
    this.router
      .navigateByUrl(AppRoutes.WORKSPACE_REPOSITORIES)
      .catch(console.error);
  }

  deleteWorkspace() {
    this.userService.deleteCurrentWorkspace();
  }

  refreshOnce() {
    this.repositoryObserverService.refreshOnce().catch(console.error);
  }

  toggleAutoRefresh() {
    this.isRefreshing ? this.repositoryObserverService.pause() : this.repositoryObserverService.refresh();
  }
}
