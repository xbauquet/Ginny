import {Injectable} from '@angular/core';
import {PaginateInterface} from "@octokit/plugin-paginate-rest";
import {RestEndpointMethods} from "@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types";
import {Api} from "@octokit/plugin-rest-endpoint-methods/dist-types/types";
import {Octokit} from "@octokit/rest";
import {Octokit as Core} from "@octokit/core";
import {BehaviorSubject} from "rxjs";

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
}
