import {Component} from '@angular/core';
import {GithubApiService} from "../github-api/github-api.service";
import {Router} from "@angular/router";
import {AppRoutes} from "../appRoutes.enum";

/**
 * Allow the user to connect to Ginny using a Github token
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private githubApiService: GithubApiService,
              private router: Router) {
    this.githubApiService.isLoggedIn.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.router
          .navigateByUrl(AppRoutes.CI_CD)
          .catch(console.error);
      }
    })
  }

  logIn(value: string) {
    this.githubApiService.logIn(value);
  }
}
