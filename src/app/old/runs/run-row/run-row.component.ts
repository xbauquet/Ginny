import {Component, Input} from '@angular/core';
import {Workflow} from "../../../github-api/workflow.model";
import {Run} from "../../../github-api/run.model";
import {Repository} from "../../../github-api/repository.model";
import {MatDialog} from "@angular/material/dialog";
import {WorkflowRunnerComponent} from "../workflow-runner/workflow-runner.component";

@Component({
  selector: 'app-run-row',
  templateUrl: './run-row.component.html',
  styleUrls: ['./run-row.component.scss']
})
export class RunRowComponent {

  @Input() workflow!: Workflow;
  @Input() runs: Run[] = [];
  @Input() repo!: Repository;

  constructor(private dialog: MatDialog) {
  }

  runWorkflow() {
    const config = WorkflowRunnerComponent.config;
    config.data = {workflow: this.workflow, repo: this.repo};
    this.dialog.open(WorkflowRunnerComponent, config);
  }
}
