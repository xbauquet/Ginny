import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Location} from '@angular/common';
import {AppRoutes} from "../../appRoutes.enum";
import {UserService, Workspace} from "../../user/user.service";

@Component({
  selector: 'app-workspace-creation',
  templateUrl: './workspace-creation.component.html',
  styleUrls: ['./workspace-creation.component.scss']
})
export class WorkspaceCreationComponent implements OnInit {

  isCancellable = true;

  constructor(private userService: UserService,
              private location: Location,
              private router: Router) {
  }

  ngOnInit() {
    this.isCancellable = !!this.userService.user.value && this.userService.user.value.workspaces.length > 0;
  }

  create(value: string) {
    const workspace = new Workspace(value);
    this.userService.addWorkspace(workspace);
    this.router
      .navigateByUrl(AppRoutes.WORKSPACE_REPOSITORIES)
      .catch(console.error);
  }

  cancel() {
    this.location.back();
  }
}
