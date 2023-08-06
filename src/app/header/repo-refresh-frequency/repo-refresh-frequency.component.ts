import {Component} from '@angular/core';
import {MatDialogConfig, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-repo-refresh-frequency',
  templateUrl: './repo-refresh-frequency.component.html',
  styleUrls: ['./repo-refresh-frequency.component.scss']
})
export class RepoRefreshFrequencyComponent {

  public static config: MatDialogConfig = {
    minWidth: '60vw',
    maxWidth: 'none',
    maxHeight: '100vh',
    backdropClass: 'blur',
    panelClass: 'matDialogPanel',
    disableClose: true,
    data: {}
  };

  constructor(private dialogRef: MatDialogRef<RepoRefreshFrequencyComponent>) {
  }

  close() {
    this.dialogRef.close();
  }

  setFrequency(frequencyString: string) {
    let frequency = Number(frequencyString);
    if (frequency < 0) {
      frequency = 0;
    }
    this.dialogRef.close({frequency});
  }
}
