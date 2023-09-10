import {Component} from '@angular/core';
import {MatDialogConfig, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-create-pipeline',
  templateUrl: './create-pipeline.component.html',
  styleUrls: ['./create-pipeline.component.scss']
})
export class CreatePipelineComponent {
  public static config: MatDialogConfig = {
    minWidth: '30vw',
    maxWidth: 'none',
    maxHeight: '100vh',
    backdropClass: 'blur',
    panelClass: 'matDialogPanel',
    disableClose: true
  };

  constructor(private dialogRef: MatDialogRef<CreatePipelineComponent>) {
  }

  close() {
    this.dialogRef.close();
  }

  create(name: string) {
    if (name) {
      this.dialogRef.close({name});
    }
  }
}
