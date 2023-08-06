import {Component} from '@angular/core';
import {ContextService} from "../context.service";
import {GithubApiService} from "../github-api.service";
import packageJson from '../../../package.json';
import {RepositoryObserverService} from "../runs/repository-observer.service";
import {MatDialog} from "@angular/material/dialog";
import {RepoRefreshFrequencyComponent} from "./repo-refresh-frequency/repo-refresh-frequency.component";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  // Current app color theme
  theme = "light";
  smallScreen = false;
  isLoggedIn = false;
  version: string = packageJson.version;
  showPipeline = true;
  showRuns = true;
  frequency = 0;

  constructor(private contextService: ContextService,
              private githubApiService: GithubApiService,
              private repoObserverService: RepositoryObserverService,
              private matDialog: MatDialog) {
    this.contextService.theme.subscribe(this.applyTheme);
    this.contextService.smallScreen.subscribe(v => this.smallScreen = v);
    this.githubApiService.isLoggedIn.subscribe(v => this.isLoggedIn = v);
    this.contextService.showPipelines.subscribe(v => this.showPipeline = v);
    this.contextService.showRuns.subscribe(v => this.showRuns = v);
    this.frequency = this.repoObserverService.frequency;
  }

  /**
   * Change the current app current theme
   */
  toggleTheme() {
    this.contextService.toggleTheme();
  }

  logOut() {
    this.githubApiService.logOut();
  }

  private applyTheme(newTheme: string) {
    this.theme = newTheme;
    document.body.classList.remove("dark");
    document.body.classList.remove("light");
    document.body.classList.add(newTheme);
  }

  togglePipeline() {
    this.contextService.toggleShowPipelines();
  }

  toggleRuns() {
    this.contextService.toggleShoRuns();
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
