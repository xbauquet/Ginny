import {Component} from '@angular/core';
import {Router} from "@angular/router";
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
              private userService: UserService) {
    this.userService.user.subscribe(u => {
      if (!this.user && u) {
        this.user = u;
        this.router
          .navigateByUrl(AppRoutes.CI_CD)
          .catch(console.error);
      }
    });
  }

  login(value: string) {
    this.userService
      .login(value)
      .catch(console.error);
  }
}
