import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Workflow} from "../github-api/workflow.model";
import {Repository} from "../github-api/repository.model";
import {WorkflowInputs} from "../github-api/workflow-inputs.model";

@Component({
  selector: 'app-workflow-runner',
  templateUrl: './workflow-runner.component.html',
  styleUrls: ['./workflow-runner.component.scss']
})
export class WorkflowRunnerComponent implements OnInit {
  @Input() workflow!: Workflow;
  @Input() repo!: Repository;
  @Input() branches: string[] = [];
  @Output() run = new EventEmitter<{ branch: string, inputs: any }>();

  data!: { branch: string, inputs: any };

  protected readonly Object = Object;

  ngOnInit() {
    this.data = {branch: this.repo.defaultBranch, inputs: {}};
    this.workflow.inputs.forEach(i => this.data.inputs[i.key] = i.defaultValue);
  }

  setBranch(event: any) {
    this.data.branch = event.target.value;
  }

  setValue(event: any, input: WorkflowInputs) {
    this.data.inputs[input.key] = event.target.value;
  }

  runWorkflow() {
    this.run.emit(this.data);
  }
}
