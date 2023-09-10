import {Component, Input} from '@angular/core';
import {Workflow} from "../workflow.model";
import {Run} from "../run.model";
import {Repository} from "../../repository.model";
import {MatDialog} from "@angular/material/dialog";
import {WorkflowRunnerComponent} from "../../workflow-runner/workflow-runner.component";

@Component({
  selector: 'app-ci-cd-row',
  templateUrl: './ci-cd-row.component.html',
  styleUrls: ['./ci-cd-row.component.scss']
})
export class CiCdRowComponent {
  @Input() run!: { workflow: Workflow, runs: Run[] };
  @Input() repo!: Repository;

  constructor(private dialog: MatDialog) {
  }

  runWorkflow() {
    const config = WorkflowRunnerComponent.config;
    config.data = {workflow: this.run.workflow, repo: this.repo};
    this.dialog.open(WorkflowRunnerComponent, config);
  }
}
