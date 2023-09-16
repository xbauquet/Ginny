import {Component} from '@angular/core';
import {Repository} from "../../github-api/repository.model";
import {WorkspaceService} from "../workspace.service";
import {GithubApiService} from "../../github-api/github-api.service";
import {Workspace} from "../workspace.model";

export class Filters {
  showArchived = false;
  showUnselected = true;
  showPrivate = true;
  showPublic = true;
  textFilter = "";
}

@Component({
  selector: 'app-workspace-repository-selector',
  templateUrl: './workspace-repository-selector.component.html',
  styleUrls: ['./workspace-repository-selector.component.scss']
})
export class WorkspaceRepositorySelectorComponent {
  private allRepoByOwner = new Map<string, Repository[]>();

  filteredRepoByOwner = new Map<string, Repository[]>();
  selectedRepoNames: string[] = [];
  workspace?: Workspace;
  filteredRepoByOwnerKeys: string[] = [];

  filters = new Filters();
  private savedFilters?: Filters;

  isLoading = false;

  constructor(private workspaceService: WorkspaceService,
              private githubApiService: GithubApiService) {
  }

  ngOnInit(): void {
    this.init().catch(console.error);
  }

  async init() {
    const result = await this.getRepositories();
    this.allRepoByOwner = result.repoByOwner;
    this.selectedRepoNames = result.selectedRepoNames;
    this.workspace = result.workspace;
    this.filter();
  }

  selectionChanged(event: any, repo: any) {
    if (event.target.checked) {
      this.workspaceService.addRepositoryToWorkspace(repo);
      this.selectedRepoNames.push(repo.owner + "/" + repo.name);
    } else {
      this.workspaceService.removeRepositoryFromWorkspace(repo);
      this.selectedRepoNames.splice(this.selectedRepoNames.indexOf(repo.owner + "/" + repo.name), 1);
    }
  }

  filterByText(text: string) {
    this.filters.textFilter = text;
    this.savedFilters = undefined;
    this.filter();
  }

  onArchivedFilterChanged(value: boolean) {
    this.filters.showArchived = value;
    this.savedFilters = undefined;
    this.filter();
  }

  onSelectedFilterChanged(value: boolean) {
    this.filters.showUnselected = value;
    this.savedFilters = undefined;
    this.filter();
  }

  onPrivateFilterChanged(value: boolean) {
    this.filters.showPrivate = value;
    this.savedFilters = undefined;
    this.filter();
  }

  onPublicFilterChanged(value: boolean) {
    this.filters.showPublic = value;
    this.savedFilters = undefined;
    this.filter();
  }

  toggleSelected() {
    if (this.savedFilters) {
      this.filters = this.savedFilters;
      this.savedFilters = undefined;
    } else {
      this.savedFilters = this.filters;
      const newFilters = new Filters();
      newFilters.showPrivate = true;
      newFilters.showPublic = true;
      newFilters.showArchived = true;
      newFilters.showUnselected = false;
      newFilters.textFilter = "";
      this.filters = newFilters;
    }
    this.filter();
  }

  private filter() {
    const filteredRepo = new Map<string, Repository[]>();
    this.allRepoByOwner.forEach((repositories, key) => {
      const filtered = repositories
        .filter(r => !this.filters.showUnselected ? this.selectedRepoNames.includes(r.owner + "/" + r.name) : true)
        .filter(r => r.isPrivate ? this.filters.showPrivate : true)
        .filter(r => !r.isPrivate ? this.filters.showPublic : true)
        .filter(r => r.isArchived ? this.filters.showArchived : true)
        .filter(r => r.name.toUpperCase().indexOf(this.filters.textFilter.toUpperCase()) > -1);
      if (filtered.length > 0) {
        filteredRepo.set(key, filtered);
      }
    });
    this.filteredRepoByOwner = filteredRepo;
    // https://stackoverflow.com/questions/47079366/expression-has-changed-after-it-was-checked-during-iteration-by-map-keys-in-angu
    this.filteredRepoByOwnerKeys = Array.from(filteredRepo.keys());
  }

  private async getRepositories() {
    this.isLoading = true;
    const repoByOwner = new Map<string, Repository[]>();
    // const repoByOwner: any = {};
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
      selectedRepoNames = workspace.repos.map(repo => repo.owner + "/" + repo.name)
    }
    this.isLoading = false;
    return Promise.resolve({repoByOwner, selectedRepoNames, workspace});
  }
}
