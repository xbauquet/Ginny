import {Injectable} from '@angular/core';
import {PaginateInterface} from "@octokit/plugin-paginate-rest";
import {RestEndpointMethods} from "@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types";
import {Api} from "@octokit/plugin-rest-endpoint-methods/dist-types/types";
import {Octokit} from "@octokit/rest";
import {Octokit as Core} from "@octokit/core";
import {BehaviorSubject} from "rxjs";
import {Repository} from "./repository.model";
import {Run} from "./oldUI/runs/run.model";
import {Workflow} from "./oldUI/runs/workflow.model";
import {WorkflowInputs} from "./oldUI/runs/workflow-inputs.model";
import * as yaml from "js-yaml";
import {Organisation} from "./oldUI/usage/organisation.model";
import {ActionsBilling} from "./oldUI/usage/actions-billing.model";

@Injectable({
  providedIn: 'root'
})
export class GithubApiService {

  isLoggedIn = new BehaviorSubject(false);

  private octokit?: Core & { paginate: PaginateInterface } & RestEndpointMethods & Api;
  private tokenKey = "token";

  constructor() {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      this.logIn(token);
    } else {
      this.logOut();
    }
  }

  /***
   * ******************************************************************************************************************
   * Authentication
   * ******************************************************************************************************************
   */
  logIn(token: string) {
    localStorage.setItem(this.tokenKey, token);
    this.octokit = new Octokit({auth: token});
    this.isLoggedIn.next(true);
  }

  logOut() {
    localStorage.removeItem(this.tokenKey);
    this.octokit = undefined;
    this.isLoggedIn.next(false);
  }

  /***
   * ******************************************************************************************************************
   * List Repositories
   * ******************************************************************************************************************
   */
  public async listUsersRepo(): Promise<Repository[]> {
    if (this.octokit) {
      const results: any[] = await this.octokit
        .paginate(this.octokit.rest.repos.listForAuthenticatedUser.endpoint({}).url);
      return results.map(r => {
        return new Repository(
          r.name,
          r.owner.login,
          r.owner.avatar_url,
          r.html_url,
          r.private,
          r.default_branch
        );
      });
    } else {
      console.error("Calling GithubApiService.listUsersRepo but Octokit is undefined.");
      return [];
    }
  }

  /***
   * ******************************************************************************************************************
   * List Workflow Runs
   * ******************************************************************************************************************
   */
  public async listWorkflowRuns(owner: string, repo: string, workflowId: string, per_page = 1): Promise<Run[]> {
    if (this.octokit) {
      const results = await this.octokit.actions.listWorkflowRuns({
        owner: owner,
        repo: repo,
        workflow_id: workflowId,
        per_page: per_page
      });
      return results.data.workflow_runs.map(r => {
        return new Run(
          new Date(r.run_started_at!),
          r.conclusion!,
          r.status!,
          r.display_title!,
          r.head_branch!,
          r.html_url!,
          r.name!,
          r.rerun_url!,
          new Date(r.updated_at!)
        );
      });
    } else {
      console.error("Calling GithubApiService.listWorkflowRuns but Octokit is undefined.");
      return [];
    }
  }

  public async listWorkflows(owner: string, repo: string): Promise<Workflow[]> {
    if (this.octokit) {
      const workflows: any[] = await this.octokit
        .paginate(this.octokit.rest.actions.listRepoWorkflows.endpoint({owner, repo}).url);
      return Promise.all(workflows.map(async w => {
        const inputs = await this.getWorkflowDispatchOptions(owner, repo, w.path);
        return new Workflow(
          w.badge_url,
          new Date(w.created_at),
          w.html_url,
          w.id,
          w.name,
          w.path,
          w.state,
          new Date(w.updated_at),
          w.url,
          "https://github.com/" + owner + "/" + repo + "/blob/main/" + w.path,
          inputs !== undefined,
          inputs ?? []
        );
      }));
    } else {
      console.error("Calling GithubApiService.listWorkflows but Octokit is undefined.");
      return [];
    }
  }

  private async getWorkflowDispatchOptions(owner: string, repo: string, path: string) {
    try {
      const data = await this.getFileContent(owner, repo, path);
      const content: any = yaml.load(data);
      if (content.on.workflow_dispatch !== undefined) {
        if (content.on.workflow_dispatch === null) {
          return [];
        }
        return Object.entries<any>(content.on.workflow_dispatch.inputs).map(([k, v]) => new WorkflowInputs(
          k,
          v.description,
          v.required,
          v.type,
          v.default,
          v.options ?? []
        ));
      }
    } catch (e) {
      return undefined;
    }
    return undefined;
  }

  private async getFileContent(owner: string, repo: string, path: string): Promise<string> {
    try {
      if (this.octokit) {
        const result: any = await this.octokit
          .request('GET /repos/{owner}/{repo}/contents/{path}', {
            owner,
            repo,
            path
          });
        return atob(result.data.content);
      } else {
        return Promise.reject();
      }
    } catch (e) {
      return Promise.reject(e);
    }
  }

  /***
   * ******************************************************************************************************************
   * Running Workflow
   * ******************************************************************************************************************
   */
  public async listBranchNames(repo: Repository): Promise<string[]> {
    if (this.octokit) {
      const branches = await this.octokit.rest.repos.listBranches({
        owner: repo.owner,
        repo: repo.name
      });
      return branches.data.map(b => b.name);
    } else {
      console.error("Calling GithubApiService.listBranchNames but Octokit is undefined.");
      return [];
    }
  }

  public async runWorkflow(repo: {
    name: string,
    owner: string
  }, workflow: Workflow, branch: string, inputs: any = {}) {
    if (this.octokit) {
      await this.octokit.actions.createWorkflowDispatch({
        owner: repo.owner,
        repo: repo.name,
        workflow_id: workflow.id,
        ref: branch,
        inputs: this.formatRunWorkflowInputs(inputs, workflow.inputs)
      });
    } else {
      console.error("Calling GithubApiService.runWorkflow but Octokit is undefined.");
    }
  }

  /**
   * Format inputs to remove useless inputs and convert all of them to string.
   *
   * Github api only accept as inputs fields that are declared in the workflow as inputs. For example if 'branch' is
   * present in the inputs the api will return an error rather than ignoring it.
   * Inputs must also all be of type string.
   */
  private formatRunWorkflowInputs(inputs: any, workflowInputs: WorkflowInputs[]) {
    const formattedInputs: any = {};
    for (let key of Object.keys(inputs)) {
      const index = workflowInputs.findIndex(i => i.key === key);
      if (index !== -1) {
        formattedInputs[key] = String(inputs[key]);
      }
    }
    return formattedInputs;
  }

  /***
   * ******************************************************************************************************************
   * Org Billing
   * ******************************************************************************************************************
   */
  public async listUsersOrg(): Promise<Organisation[]> {
    if (this.octokit) {
      return await this.octokit
        .paginate(this.octokit.rest.orgs.listForAuthenticatedUser.endpoint({}).url)
        .then((v: any[]) => v.map(o => new Organisation(
          o.id,
          o.login,
          o.url,
          o.avatar_url
        )));
    } else {
      console.error("Calling GithubApiService.listUsersOrg but Octokit is undefined.");
      return [];
    }
  }

  public getUserAsOrg() {
    if (this.octokit) {
      return this.octokit.rest.users.getAuthenticated()
        .then(o => new Organisation(
          "" + o.data.id,
          o.data.login,
          o.url,
          o.data.avatar_url
        ));
    } else {
      console.error("Calling GithubApiService.getUserAsOrg but Octokit is undefined.");
      return Promise.reject();
    }
  }

  public async actionBillingForUser(username: string) {
    if (this.octokit) {
      return this.octokit.rest.billing.getGithubActionsBillingUser({username})
        .then(v => {
          return new ActionsBilling(
            v.data.included_minutes,
            v.data.total_minutes_used,
            v.data.total_paid_minutes_used,
            v.data.minutes_used_breakdown)
        });
    } else {
      console.error("Calling GithubApiService.actionsBillingForOrg but Octokit is undefined.");
      return Promise.reject();
    }
  }

  public actionsBillingForOrg(org: string): Promise<ActionsBilling> {
    if (this.octokit) {
      return this.octokit.rest.billing.getGithubActionsBillingOrg({org})
        .then(v => {
          return new ActionsBilling(
            v.data.included_minutes,
            v.data.total_minutes_used,
            v.data.total_paid_minutes_used,
            v.data.minutes_used_breakdown)
        });
    } else {
      console.error("Calling GithubApiService.actionsBillingForOrg but Octokit is undefined.");
      return Promise.reject();
    }
  }
}
