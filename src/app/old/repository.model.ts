/**
 * Object representing a Github repository.
 */
export class Repository {
  constructor(public readonly name: string,
              public readonly owner: string,
              public readonly ownerAvatarUrl: string,
              public readonly htmlUrl: string,
              public readonly isPrivate: boolean,
              public readonly defaultBranch: string) {
  }
}
