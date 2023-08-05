import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {Workflow} from "../workflow.model";
import {Repository} from "../../repository.model";
import {GithubApiService} from "../../github-api.service";
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-workflow-runner',
  templateUrl: './workflow-runner.component.html',
  styleUrls: ['./workflow-runner.component.scss']
})
export class WorkflowRunnerComponent implements OnInit {

  public static config: MatDialogConfig = {
    minWidth: '60vw',
    maxWidth: 'none',
    maxHeight: '100vh',
    backdropClass: 'blur',
    panelClass: 'matDialogPanel',
    disableClose: true,
    data: {}
  };

  workflow?: Workflow;
  repo?: Repository;
  branches: string[] = [];
  formData: any = {};

  constructor(private dialogRef: MatDialogRef<WorkflowRunnerComponent>,
              @Inject(MAT_DIALOG_DATA) private data: { workflow: Workflow, repo: Repository },
              private githubApiService: GithubApiService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.workflow = this.data.workflow;
    this.repo = this.data.repo;
    this.githubApiService.listBranchNames(this.repo).then(b => this.branches = b);
    const controls: any = {};
    controls['branch'] = [this.repo.defaultBranch];
    for (let input of this.workflow.inputs) {
      controls[input.key] = [input.defaultValue];
    }
    this.formData = this.formBuilder.group(controls);
  }

  close() {
    this.dialogRef.close();
  }

  run() {
    if (this.repo && this.workflow) {
      this.githubApiService
        .runWorkflow(this.repo, this.workflow, this.formData.value.branch, this.formData.value)
        .catch(e => console.error(e));
    }
  }
}
