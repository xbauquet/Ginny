import {Component} from '@angular/core';
import {ThemeService} from "./theme.service";
import {GithubApiService} from "./github-api/github-api.service";
import packageJson from "../../package.json";
import {Workspace} from "./workspace/workspace.model";
import {WorkspaceService} from "./workspace/workspace.service";
import * as uniqolor from "uniqolor";
import {Router} from "@angular/router";
import {AppRoutes} from "./appRoutes.enum";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  theme: "light" | "dark" = "light";
  isLoggedIn = false;
  version = packageJson.version;
  workspace?: Workspace;
  workspaces: Workspace[] = [];

  constructor(private themeService: ThemeService,
              private githubApiService: GithubApiService,
              private workspaceService: WorkspaceService,
              private router: Router) {
    this.themeService.theme.subscribe(v => this.theme = v);
    this.githubApiService.isLoggedIn.subscribe(v => {
      this.isLoggedIn = v;
      console.log(this.isLoggedIn);
      this.router
        .navigateByUrl(AppRoutes.AUTH)
        .catch(console.error)
    });
    this.workspaceService.workspace.subscribe(v => this.workspace = v);
    this.workspaces = this.workspaceService.workspaces;
  }

  /**
   * Rather the workspace contains repositories or not
   */
  isWorkspacePopulated() {
    return !this.router.url.includes("workspace")
      || (this.router.url.includes("workspace-repositories") && this.workspace && this.workspace.repos.length > 0);
  }

  /**
   * Generate a determinist color from the workspace name
   */
  getWorkspaceColor(workspaceName: string): string {
    return uniqolor(workspaceName).color;
  }

  /*****************************************
   * Methods for the workspace menu
   *****************************************/
  selectWorkspace(workspace: Workspace) {
    this.workspaceService.selectWorkspace(workspace);
  }

  createWorkspace() {
    this.router
      .navigateByUrl(AppRoutes.WORKSPACE_CREATION)
      .catch(console.error);
  }

  /*****************************************
   * Methods for the settings menu
   *****************************************/
  toggleTheme() {
    this.themeService.toggleTheme();
  }

  logOut() {
    this.githubApiService.logOut();
  }
}
