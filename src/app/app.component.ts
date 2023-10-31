import {Component, HostListener} from '@angular/core';
import {ThemeService} from "./theme.service";
import packageJson from "../../package.json";
import * as uniqolor from "uniqolor";
import {Router} from "@angular/router";
import {AppRoutes} from "./appRoutes.enum";
import {User, UserService, Workspace} from "./user/user.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  theme: "light" | "dark" = "light";
  user?: User;
  version = packageJson.version;
  workspace?: Workspace;
  workspaces: Workspace[] = [];
  beforeInstallPrompt?: any;

  private smallMenuLocalStorageKey = "ginny-small-menu";
  smallMenu = false;

  constructor(private themeService: ThemeService,
              private userService: UserService,
              private router: Router) {
    const smallMenu = localStorage.getItem(this.smallMenuLocalStorageKey);
    this.smallMenu = smallMenu === "true";

    this.themeService.theme.subscribe(v => this.theme = v);
    this.userService.user.subscribe(u => {
      this.user = u;
      if (this.user) {
        this.workspaces = this.user.workspaces;
      }
    });
    this.userService.workspace.subscribe(w => this.workspace = w);
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
    this.userService.selectWorkspace(workspace);
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

  logout() {
    this.userService.logout();
  }

  @HostListener('window:beforeinstallprompt', ['$event'])
  onBeforeInstallPrompt(event: any) {
    console.log("App can be installed");
    this.beforeInstallPrompt = event;
  }

  installApp() {
    if (this.beforeInstallPrompt) {
      this.beforeInstallPrompt.prompt();
    }
  }

  toggleSmallMenu() {
    this.smallMenu = !this.smallMenu
    localStorage.setItem(this.smallMenuLocalStorageKey, this.smallMenu + "");
  }
}
