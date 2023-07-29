import {Component, HostListener, OnInit} from '@angular/core';
import {ContextService} from "./context.service";
import {GithubApiService} from "./github-api.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  isLoggedIn = false;
  showRepositorySelector = false;

  constructor(private contextService: ContextService,
              private githubApiService: GithubApiService) {
    this.githubApiService.isLoggedIn.subscribe(v => this.isLoggedIn = v);
    this.contextService.showRepositorySelector.subscribe(v => this.showRepositorySelector = v);
  }

  ngOnInit() {
    this.contextService.setSmallScreen(window.innerWidth < 1024);
  }

  @HostListener("window:resize", []) onResize() {
    this.contextService.setSmallScreen(window.innerWidth < 1024);
  }

  hideRepositorySelector() {
    this.contextService.setShowRepositorySelector(false);
  }
}
