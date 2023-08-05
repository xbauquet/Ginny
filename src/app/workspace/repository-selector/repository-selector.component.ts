import {Component, OnInit} from '@angular/core';
import {WorkspaceService} from "../workspace.service";
import {Repository} from "../../repository.model";
import {GithubApiService} from "../../github-api.service";
import {Workspace} from "../workspace.model";
import {MatDialogConfig, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-repository-selector',
  templateUrl: './repository-selector.component.html',
  styleUrls: ['./repository-selector.component.scss']
})
export class RepositorySelectorComponent implements OnInit {

  public static config: MatDialogConfig = {
    minWidth: '60vw',
    maxWidth: 'none',
    maxHeight: '98vh',
    backdropClass: 'blur',
    panelClass: 'matDialogPanel',
    disableClose: true,
    data: {}
  };

  repoByOwner = new Map<string, Repository[]>();
  selectedRepoNames: string[] = [];
  workspace?: Workspace;

  constructor(private workspaceService: WorkspaceService,
              private githubApiService: GithubApiService,
              private dialogRef: MatDialogRef<RepositorySelectorComponent>) {
  }

  ngOnInit(): void {
    this.repoByOwner = new Map<string, Repository[]>();
    this.selectedRepoNames = [];
    this.getRepositories()
      .then(result => {
        this.repoByOwner = result.repoByOwner;
        this.selectedRepoNames = result.selectedRepoNames;
        this.workspace = result.workspace;
      })
  }

  selectionChanged(event: any, repo: any) {
    if (event.target.checked) {
      this.workspaceService.addRepositoryToWorkspace(repo);
    } else {
      this.workspaceService.removeRepositoryFromWorkspace(repo);
    }
  }

  close() {
    this.dialogRef.close();
  }

  private async getRepositories() {
    const repoByOwner = new Map<string, Repository[]>();
    const repos = await this.githubApiService.listUsersRepo();
    repos.forEach(repository => {
      if (!repoByOwner.get(repository.owner)) {
        repoByOwner.set(repository.owner, []);
      }
      repoByOwner.get(repository.owner)!.push(repository);
    });
    const workspace = this.workspaceService.workspace.value;
    let selectedRepoNames: string[] = [];
    if (workspace) {
      selectedRepoNames = workspace.repos.map(repo => repo.name)
    }
    return Promise.resolve({repoByOwner, selectedRepoNames, workspace});
  }
}
