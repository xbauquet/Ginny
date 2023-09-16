import {Component} from '@angular/core';
import {Organisation} from "../github-api/organisation.model";
import {ActionsBilling} from "../github-api/actions-billing.model";
import {Repository} from "../github-api/repository.model";
import {Workflow} from "../github-api/workflow.model";
import {Run} from "../github-api/run.model";

/**
 * Component displaying all the micro component.
 * This component is not made for the end user, it is a
 * tool for development and debug.
 */
@Component({
  selector: 'app-style',
  templateUrl: './style.component.html',
  styleUrls: ['./style.component.scss']
})
export class StyleComponent {
    fakeOrg() {
      return new Organisation(
        "",
        "Org name",
        "",
      "https://avatars.githubusercontent.com/u/8179943"
      );
    }

    fakeBilling() {
      return new ActionsBilling(
        2000,
        1200,
        0,
        {
          UBUNTU: 300,
          MAC: 800,
          WINDOWS: 100
        }
      )
    }

  fakeRepo(): Repository {
    return new Repository(
      "Repo name",
      "xbauquet",
      "",
      "https://avatars.githubusercontent.com/u/8179943",
      true,
      "main",
      false,
      new Date()
    );
  }

  fakeRun(): { workflow: Workflow, runs: Run[] } {
    const workflow = new Workflow(
      "",
      new Date(),
      "",
      "",
      "Workflow name",
      "",
      "",
      new Date(),
      "",
      "",
      true,
      []
    );

    const run = new Run(
      new Date(),
      "success",
      "completed",
      "Run display title",
      "main",
      "",
      "Run name",
      "",
      new Date(),
      "fix: some kind of error",
      ""
    );
    return {workflow, runs: [run]};
  }
}
