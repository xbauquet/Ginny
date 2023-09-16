import {Component} from '@angular/core';
import {ContextService} from "./old/context.service";
import {GithubApiService} from "./github-api/github-api.service";
import packageJson from "../../package.json";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  theme: "light" | "dark" = "light";
  isLoggedIn = false;
  version = packageJson.version;


  constructor(private contextService: ContextService,
              private githubApiService: GithubApiService) {
    this.contextService.theme.subscribe(v => this.applyTheme(v));
    this.githubApiService.isLoggedIn.subscribe(v => this.isLoggedIn = v);
  }

  toggleTheme() {
    this.contextService.toggleTheme();
  }

  logOut() {
    this.githubApiService.logOut();
  }

  private applyTheme(newTheme: "light" | "dark") {
    this.theme = newTheme;
    document.body.classList.remove("dark");
    document.body.classList.remove("light");
    document.body.classList.add(newTheme);
  }
}
