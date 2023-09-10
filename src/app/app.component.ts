import {Component} from '@angular/core';
import packageJson from "../../package.json";
import {ContextService} from "./context.service";
import {RepoRefreshFrequencyComponent} from "./repo-refresh-frequency/repo-refresh-frequency.component";
import {MatDialog} from "@angular/material/dialog";
import {GithubApiService} from "./github-api.service";
import {RepositoryObserverService} from "./ci-cd/repository-observer.service";
import {WorkspaceService} from "./workspace/workspace.service";
import {Workspace} from "./workspace/workspace.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  isLoggedIn = false;
  theme = "light";
  version: string = packageJson.version;
  frequency = 0;
  workspace: Workspace | undefined;

  constructor(private contextService: ContextService,
              private githubApiService: GithubApiService,
              private repoObserverService: RepositoryObserverService,
              private matDialog: MatDialog,
              private workspaceService: WorkspaceService) {
    this.githubApiService.isLoggedIn.subscribe(v => this.isLoggedIn = v);
    this.contextService.theme.subscribe(this.applyTheme);
    this.frequency = this.repoObserverService.frequency;
    this.workspaceService.workspace.subscribe(w => this.workspace = w);
  }

  logOut() {
    this.githubApiService.logOut();
  }

  toggleTheme() {
    this.contextService.toggleTheme();
  }

  private applyTheme(newTheme: string) {
    this.theme = newTheme;
    document.body.classList.remove("dark");
    document.body.classList.remove("light");
    document.body.classList.add(newTheme);
  }

  setFrequency() {
    this.matDialog.open(RepoRefreshFrequencyComponent, RepoRefreshFrequencyComponent.config)
      .afterClosed()
      .subscribe(value => {
        if (value && value.frequency) {
          this.repoObserverService.setFrequency(value.frequency * 1000);
          this.frequency = this.repoObserverService.frequency;
        }
      });
  }
}
