import {Component} from '@angular/core';
import {ContextService} from "./old/context.service";
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

  constructor(private contextService: ContextService,
              private githubApiService: GithubApiService,
              private workspaceService: WorkspaceService,
              private router: Router) {
    this.contextService.theme.subscribe(v => this.applyTheme(v));
    this.githubApiService.isLoggedIn.subscribe(v => this.isLoggedIn = v);
    this.workspaceService.workspace.subscribe(v => this.workspace = v);
    this.workspaces = this.workspaceService.workspaces;
  }

  isWorkspacePopulated() {
    return !this.router.url.includes("workspace")
      || (this.router.url.includes("workspace-repositories") && this.workspace && this.workspace.repos.length > 0);
  }

  selectWorkspace(workspace: Workspace) {
    this.workspaceService.selectWorkspace(workspace);
  }

  createWorkspace() {
    this.router
      .navigateByUrl(AppRoutes.WORKSPACE_CREATION)
      .catch(console.error);
  }

  toggleTheme() {
    this.contextService.toggleTheme();
  }

  logOut() {
    this.githubApiService.logOut();
  }

  getColor(text: string): string {
    return uniqolor(text).color;
  }

  private applyTheme(newTheme: "light" | "dark") {
    this.theme = newTheme;
    document.body.classList.remove("dark");
    document.body.classList.remove("light");
    document.body.classList.add(newTheme);
  }
}
