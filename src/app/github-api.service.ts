import {Injectable} from '@angular/core';
import {PaginateInterface} from "@octokit/plugin-paginate-rest";
import {RestEndpointMethods} from "@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types";
import {Api} from "@octokit/plugin-rest-endpoint-methods/dist-types/types";
import {Octokit} from "@octokit/rest";
import {Octokit as Core} from "@octokit/core";
import {BehaviorSubject} from "rxjs";
import {Repository} from "./repository.model";

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
          r.private
        );
      });
    } else {
      console.error("Calling GithubApiService.listUsersRepo but Octokit is undefined.");
      return [];
    }
  }
}
