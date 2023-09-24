/*
  Statuses: queued, in_progress, completed
  Conclusions: success, failure, neutral, cancelled, timed_out, action_required
*/

export class Run {
  constructor(public startDate: Date,
              public conclusion: string,
              public status: string,
              public displayTitle: string,
              public headBranch: string,
              public htmlUrl: string,
              public runName: string,
              public rerunUrl: string,
              public updateDate: Date,
              public commitMessage: string,
              public jobsUrl: string) {
  }
}
