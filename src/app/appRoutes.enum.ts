import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, Routes} from "@angular/router";
import {StyleComponent} from "./style/style.component";
import {inject} from "@angular/core";
import {GithubApiService} from "./github-api/github-api.service";
import {LoginComponent} from "./login/login.component";
import {CiCdComponent} from "./ci-cd/ci-cd.component";
import {WorkspaceService} from "./workspace/workspace.service";
import {WorkspaceCreationComponent} from "./workspace/workspace-creation/workspace-creation.component";
import {
  WorkspaceRepositorySelectorComponent
} from "./workspace/workspace-repository-selector/workspace-repository-selector.component";

export enum AppRoutes {
  STYLE = "style",
  AUTH = "auth",
  CI_CD = "ci-cd",
  WORKSPACE_CREATION = "workspace-creation",
  WORKSPACE_REPOSITORIES = "workspace-repositories"
}

export const authGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return inject(GithubApiService).isLoggedIn.value ? true : inject(Router).createUrlTree(['/' + AppRoutes.AUTH]);
}

export const workspaceGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return inject(WorkspaceService).workspaces.length > 0 ? true : inject(Router).createUrlTree(['/' + AppRoutes.WORKSPACE_CREATION]);
}

export const workspaceRepositoriesGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const workspace = inject(WorkspaceService).workspace.value;
  return workspace && workspace.repos.length > 0 ? true : inject(Router).createUrlTree(['/' + AppRoutes.WORKSPACE_REPOSITORIES]);
}

export const routes: Routes = [
  {path: '', redirectTo: '/' + AppRoutes.CI_CD, pathMatch: 'full'},
  {path: AppRoutes.AUTH, component: LoginComponent},
  {path: AppRoutes.STYLE, component: StyleComponent},

  {
    path: AppRoutes.WORKSPACE_CREATION,
    component: WorkspaceCreationComponent,
    canActivate: [authGuard]
  },
  {
    path: AppRoutes.WORKSPACE_REPOSITORIES,
    component: WorkspaceRepositorySelectorComponent,
    canActivate: [authGuard, workspaceGuard]
  },

  {
    path: AppRoutes.CI_CD,
    component: CiCdComponent,
    canActivate: [authGuard, workspaceGuard, workspaceRepositoriesGuard]
  }
];
