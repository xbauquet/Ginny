import {Component} from '@angular/core';
import {RepoRun} from "./repo.run";
import {Workspace} from "../workspace/workspace.model";
import {RepositoryObserverService} from "./repository-observer.service";
import {WorkspaceService} from "../workspace/workspace.service";
import {MatDialog} from "@angular/material/dialog";
import {RepositorySelectorComponent} from "../repository-selector/repository-selector.component";

@Component({
  selector: 'app-ci-cd',
  templateUrl: './ci-cd.component.html',
  styleUrls: ['./ci-cd.component.scss']
})
export class CiCdComponent {
  repoRuns: RepoRun[] = [];
  selectedWorkspace: Workspace | undefined;

  constructor(private repositoryObserverService: RepositoryObserverService,
              private workspaceService: WorkspaceService,
              private dialog: MatDialog) {
    this.workspaceService.workspace.subscribe(w => this.selectedWorkspace = w);
    this.repositoryObserverService.runRepos.subscribe(v => this.repoRuns = v);
  }

  changeRepositories() {
    this.dialog.open(RepositorySelectorComponent, RepositorySelectorComponent.config);
  }

  deleteWorkspace() {
    this.workspaceService.delete();
  }

  refreshOnce() {
    this.repositoryObserverService.refreshOnce().catch(e => console.error(e));
  }

  autoRefresh() {
    if (this.repositoryObserverService.refreshing) {
      this.repositoryObserverService.pause();
    } else {
      this.repositoryObserverService.refresh();
    }
  }
}
