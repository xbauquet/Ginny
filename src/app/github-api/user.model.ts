export class User {
  constructor(public readonly name: string,
              public readonly login: string,
              public readonly email: string,
              public readonly avatar_url: string,
              public readonly html_url: string) {
  }
}
