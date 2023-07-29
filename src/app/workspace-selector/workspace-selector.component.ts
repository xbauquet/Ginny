import {Component} from '@angular/core';
import {Workspace} from "./workspace.model";
import {WorkspaceService} from "./workspace.service";

@Component({
  selector: 'app-workspace-selector',
  templateUrl: './workspace-selector.component.html',
  styleUrls: ['./workspace-selector.component.scss']
})
export class WorkspaceSelectorComponent {

  workspace?: Workspace
  hasNext = false;
  hasPrevious = false;
  showNewWorkspace = false;

  constructor(private workspaceService: WorkspaceService) {
    this.workspaceService.workspace.subscribe(v => this.workspace = v);
    this.workspaceService.hasNext.subscribe(v => this.hasNext = v);
    this.workspaceService.hasPrevious.subscribe(v => this.hasPrevious = v);
  }

  selectPreviousWorkspace() {
    this.workspaceService.previous();
  }

  selectNextWorkspace() {
    this.workspaceService.next();
  }

  addWorkspace(name: string) {
    if (name === undefined || name === "") {
      console.log("Name was empty");
      return;
    }
    const workspace = new Workspace(name, []);
    this.workspaceService.add(workspace);
    this.showNewWorkspace = false;
  }

  deleteWorkspace() {
    this.workspaceService.delete();
  }
}
