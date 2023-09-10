import {Component} from '@angular/core';
import {WorkspaceService} from "../../../workspace/workspace.service";
import {RepositoryObserverService} from "../repository-observer.service";
import {ContextService} from "../../../context.service";
import {Repository} from "../../../repository.model";
import {Workflow} from "../workflow.model";
import {Workspace} from "../../../workspace/workspace.model";
import {RepoRun} from "../repo.run";

@Component({
  selector: 'app-run-list',
  templateUrl: './run-list.component.html',
  styleUrls: ['./run-list.component.scss']
})
export class RunListComponent {

  repoRuns: RepoRun[] = [];
  openRepos = new Map<string, boolean>();
  isSmallScreen = false;
  workspace?: Workspace;

  constructor(private contextService: ContextService,
              public repositoryObserverService: RepositoryObserverService,
              private workspaceService: WorkspaceService) {
    this.workspaceService.workspace.subscribe(w => this.workspace = w);
    this.repositoryObserverService.runRepos.subscribe(i => this.repoRuns = i);
    this.contextService.smallScreen.subscribe(v => this.isSmallScreen = v);
  }

  refreshOnce() {
    this.repositoryObserverService.refreshOnce().catch(e => console.error(e));
  }

  toggleRefresh() {
    if (this.repositoryObserverService.refreshing) {
      this.repositoryObserverService.pause();
    } else {
      this.repositoryObserverService.refresh();
    }
  }

  toggleWorkflow(repo: Repository) {
    const key = repo.owner + '/' + repo.name;
    this.openRepos.set(key, !this.openRepos.get(key));
  }
}
