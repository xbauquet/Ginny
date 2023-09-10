import {Component} from '@angular/core';
import {WorkspaceService} from "../workspace/workspace.service";
import {Workspace} from "../workspace/workspace.model";

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent {
  selectedWorkspace: Workspace | undefined;

  constructor(private workspaceService: WorkspaceService) {
    this.workspaceService.workspace.subscribe(w => this.selectedWorkspace = w);
  }
}
