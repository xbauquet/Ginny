import {Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AppRoutes} from "../appRoutes.enum";
import {User, UserService} from "../user/user.service";

/**
 * Allow the user to connect to Ginny using a Github token
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  private user?: User;

  constructor(private router: Router,
              private userService: UserService,
              private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params["code"]) {
        this.login(params["code"]);
      }
    })

    this.userService.user.subscribe(u => {
      if (!this.user && u) {
        this.user = u;
        this.router
          .navigateByUrl(AppRoutes.CI_CD)
          .catch(console.error);
      }
    });
  }

  private async login(code: string) {
    try {
      const response = await fetch("https://xbauquet.eu/ginny/auth/app?code=" + code);
      const token = await response.text();
      await this.userService.login(token);
    } catch (e) {
      console.error(e);
    }
  }

  loginWithGithub() {
    const CLIENT_ID = "98a0614180ea7e399a35";
    // admin:org is necessary for billing
    const scopes = ["admin:org", "read:packages", "read:user", "repo", "workflow"];
    const urlParams = new URLSearchParams();
    urlParams.append("client_id", CLIENT_ID);
    urlParams.append("scope", scopes.join("%20"));
    window.location.assign("https://github.com/login/oauth/authorize?" + urlParams);
  }
}
