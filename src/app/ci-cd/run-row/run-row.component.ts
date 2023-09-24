import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Repository} from "../../github-api/repository.model";
import {Workflow} from "../../github-api/workflow.model";
import {Run} from "../../github-api/run.model";

/**
 * Displays the result of the last run of a Github actions (Workflow)
 */
@Component({
  selector: 'app-run-row',
  templateUrl: './run-row.component.html',
  styleUrls: ['./run-row.component.scss']
})
export class RunRowComponent {

  @Input() run!: { workflow: Workflow, runs: Run[] };
  @Input() repo!: Repository;
  @Output() runWorkflow = new EventEmitter<void>();

}
