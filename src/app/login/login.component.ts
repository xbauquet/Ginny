import {Component} from '@angular/core';
import {GithubApiService} from "../github-api.service";
import {ContextService} from "../context.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  theme: "light" | "dark" = "light";

  constructor(private githubApiService: GithubApiService,
              private contextService: ContextService) {
    this.contextService.theme.subscribe(t => this.theme = t);
  }

  connect(value: string) {
    this.githubApiService.logIn(value);
  }
}
