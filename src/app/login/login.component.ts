import {Component} from '@angular/core';
import {GithubApiService} from "../github-api.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private githubApiService: GithubApiService) {
  }

  logIn(token: string) {
    this.githubApiService.logIn(token);
  }
}
