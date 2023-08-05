import {Component} from '@angular/core';
import {ContextService} from "../context.service";
import {GithubApiService} from "../github-api.service";
import packageJson from '../../../package.json';

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

  constructor(private contextService: ContextService,
              private githubApiService: GithubApiService) {
    this.contextService.theme.subscribe(this.applyTheme);
    this.contextService.smallScreen.subscribe(v => this.smallScreen = v);
    this.githubApiService.isLoggedIn.subscribe(v => this.isLoggedIn = v);
    this.contextService.showPipelines.subscribe(v => this.showPipeline = v);
    this.contextService.showRuns.subscribe(v => this.showRuns = v);
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

  toggleActions() {
    this.contextService.toggleShoRuns();
  }
}
