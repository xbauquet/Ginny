import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, Routes} from "@angular/router";
import {StyleComponent} from "./style/style.component";
import {inject} from "@angular/core";
import {GithubApiService} from "./github-api/github-api.service";
import {LoginComponent} from "./login/login.component";
import {CiCdComponent} from "./ci-cd/ci-cd.component";

export enum AppRoutes {
  STYLE = "style",
  AUTH = "auth",
  CI_CD = "ci-cd"
}

export const authGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return inject(GithubApiService).isLoggedIn.value ? true : inject(Router).navigateByUrl('/' + AppRoutes.AUTH);
}

export const routes: Routes = [
  {path: '', redirectTo: '/' + AppRoutes.CI_CD, pathMatch: 'full'},
  {path: AppRoutes.CI_CD, component: CiCdComponent, canActivate: [authGuard]},
  {path: AppRoutes.AUTH, component: LoginComponent},
  {path: AppRoutes.STYLE, component: StyleComponent}
];
