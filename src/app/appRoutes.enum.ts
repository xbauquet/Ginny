import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, Routes} from "@angular/router";
import {StyleComponent} from "./style/style.component";
import {inject} from "@angular/core";
import {LoginComponent} from "./login/login.component";
import {CiCdComponent} from "./ci-cd/ci-cd.component";
import {WorkspaceCreationComponent} from "./workspace/workspace-creation/workspace-creation.component";
import {
  WorkspaceRepositorySelectorComponent
} from "./workspace/workspace-repository-selector/workspace-repository-selector.component";
import {UsageComponent} from "./usage/usage.component";
import {PipelineComponent} from "./pipeline/pipeline.component";
import {UserService} from "./user/user.service";

export enum AppRoutes {
  STYLE = "style",
  AUTH = "auth",
  CI_CD = "ci-cd",
  WORKSPACE_CREATION = "workspace-creation",
  WORKSPACE_REPOSITORIES = "workspace-repositories",
  USAGE = "usage",
  PIPELINE = "pipeline"
}

/**
 * Redirect the user to the login page is not authenticated
 */
export const authGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return inject(UserService).user.value
    ? true
    : inject(Router).createUrlTree(['/' + AppRoutes.AUTH]);
}

/**
 * Redirect the user to the Workspace creation page if the list of workspaces is empty
 */
export const workspaceGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return inject(UserService).user.value && inject(UserService).user.value!.workspaces.length > 0
    ? true
    : inject(Router).createUrlTree(['/' + AppRoutes.WORKSPACE_CREATION]);
}

/**
 * Redirect the user to the Workspace repository selection page if the workspace doesn't have any repositories
 */
export const workspaceRepositoriesGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const workspace = inject(UserService).workspace.value;
  return workspace && workspace.repos.length > 0
    ? true
    : inject(Router).createUrlTree(['/' + AppRoutes.WORKSPACE_REPOSITORIES]);
}

export const routes: Routes = [
  {path: '', redirectTo: AppRoutes.CI_CD, pathMatch: "full"},
  {path: AppRoutes.STYLE, component: StyleComponent},
  {
    path: AppRoutes.AUTH,
    component: LoginComponent
  },
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
  },
  {
    path: AppRoutes.USAGE,
    component: UsageComponent,
    canActivate: [authGuard, workspaceGuard, workspaceRepositoriesGuard]
  },
  {
    path: AppRoutes.PIPELINE,
    component: PipelineComponent,
    canActivate: [authGuard, workspaceGuard, workspaceRepositoriesGuard]
  }
];
