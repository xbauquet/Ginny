import {Component} from '@angular/core';
import {Workspace} from "./workspace.model";
import {WorkspaceService} from "./workspace.service";
import {MatDialog} from "@angular/material/dialog";
import * as uniqolor from "uniqolor";
import {WorkspaceCreatorComponent} from "./workspace-creator/workspace-creator.component";
import {RepositorySelectorComponent} from "../repository-selector/repository-selector.component";

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent {
  workspaces: Workspace[];
  selectedWorkspace: Workspace | undefined;

  constructor(private workspaceService: WorkspaceService,
              private dialog: MatDialog) {
    this.workspaceService.workspace.subscribe(v => this.selectedWorkspace = v);
    this.workspaces = this.workspaceService.workspaces;
  }

  addWorkspace() {
    const config = WorkspaceCreatorComponent.config;
    config.data = {closable: !!this.selectedWorkspace};
    this.dialog.open(WorkspaceCreatorComponent, config)
      .afterClosed()
      .subscribe(value => {
        if (value) {
          const workspace = new Workspace(value.name, []);
          this.workspaceService.add(workspace);
          this.chooseRepositoriesForNewWorkspace();
        }
      });
  }

  private chooseRepositoriesForNewWorkspace() {
    this.dialog.open(RepositorySelectorComponent, RepositorySelectorComponent.config);
  }

  selectWorkspace(workspace: Workspace) {
    this.workspaceService.selectWorkspace(workspace);
  }

  getColor(text: string): string {
    return uniqolor(text).color;
  }
}
