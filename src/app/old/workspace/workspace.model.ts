import {Repository} from "../../github-api/repository.model";

/**
 * Class representing a workspace.
 * A workspace is a named group of repositories.
 */
export class Workspace {
  constructor(public readonly name: string,
              public repos: Repository[] = []) {
  }
}
