import {Component, Input} from '@angular/core';
import {Workflow} from "../workflow.model";
import {Run} from "../run.model";
import {Repository} from "../../repository.model";

@Component({
  selector: 'app-run-row',
  templateUrl: './run-row.component.html',
  styleUrls: ['./run-row.component.scss']
})
export class RunRowComponent {
  @Input() workflow!: Workflow;
  @Input() runs: Run[] = [];
  @Input() repo!: Repository;

  runWorkflow() {
    // TODO
  }
}
