import {Component, OnInit} from '@angular/core';
import {WorkspaceService} from "../workspace.service";
import {Router} from "@angular/router";
import {Workspace} from "../workspace.model";
import {Location} from '@angular/common';
import {AppRoutes} from "../../appRoutes.enum";

@Component({
  selector: 'app-workspace-creation',
  templateUrl: './workspace-creation.component.html',
  styleUrls: ['./workspace-creation.component.scss']
})
export class WorkspaceCreationComponent implements OnInit {

  isCancellable = true;

  constructor(private workspaceService: WorkspaceService,
              private location: Location,
              private router: Router) {
  }

  ngOnInit() {
    this.isCancellable = this.workspaceService.workspaces.length > 0;
  }

  create(value: string) {
    const workspace = new Workspace(value);
    this.workspaceService.add(workspace);
    this.router
      .navigateByUrl(AppRoutes.WORKSPACE_REPOSITORIES)
      .catch(console.error);
  }

  cancel() {
    this.location.back();
  }
}
