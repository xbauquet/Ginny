import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-workspace-creator',
  templateUrl: './workspace-creator.component.html',
  styleUrls: ['./workspace-creator.component.scss']
})
export class WorkspaceCreatorComponent {

  public static config: MatDialogConfig = {
    minWidth: '30vw',
    maxWidth: 'none',
    maxHeight: '100vh',
    backdropClass: 'blur',
    panelClass: 'matDialogPanel',
    disableClose: true,
    data: {closable: true},
  };

  constructor(private dialogRef: MatDialogRef<WorkspaceCreatorComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { closable: boolean }) {
    this.dialogRef.disableClose = !data.closable;
  }

  close() {
    this.dialogRef.close();
  }

  createWorkspace(name: string) {
    if (name) {
      this.dialogRef.close({name});
    }
  }
}
