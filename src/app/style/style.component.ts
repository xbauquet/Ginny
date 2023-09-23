import {Component} from '@angular/core';
import {Organisation} from "../github-api/organisation.model";
import {ActionsBilling} from "../github-api/actions-billing.model";
import {Repository} from "../github-api/repository.model";
import {Workflow} from "../github-api/workflow.model";
import {Run} from "../github-api/run.model";
import {PipelineHtmlBuilder} from "../pipeline/pipeline-html.builder";
import {User} from "../user/user.service";

/**
 * Component displaying components of the app in one page.
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

  fakeUser() {
    const user = new User();
    user.name = "Xavier";
    user.login = "xbauquet";
    user.email = "xavier@github.com";
    user.avatar_url = "https://avatars.githubusercontent.com/u/8179943";
    user.html_url = "https://github.com/xbauquet";
    user.workspaces = [];
    return user;
  }

  getPipelineNode() {
    const data = {
      boolean: {key: 'boolean', value: true, type: 'boolean', options: [], description: 'boolean'},
      choice: {key: 'choice', value: 'choice1', type: 'choice', options: ['choice1', 'choice2'], description: 'choice'},
      number: {key: 'number', value: 5, type: 'number', options: [], description: 'This is a important number'},
      text: {key: 'text', value: 'defaultText', type: 'string', options: [], description: 'text'}
    };

    const builder = new PipelineHtmlBuilder();

    return `
      <div class="drawflow-container parent-drawflow" style="overflow: unset">
        <div class="drawflow">
          <div class="parent-node">
            <div class="drawflow-node">
              <div class="inputs">
                <div class="input input_1"></div>
              </div>
              <div class="drawflow_content_node">
                ${builder.getHTML("xbauquet/Ginny", "Publish", data, ["main", "dev"])}
              </div>
              <div class="outputs">
                <div class="output output_1"></div>
                <div class="output output_2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  getPipelineNodeSelected() {
    const data = {
      boolean: {key: 'boolean', value: true, type: 'boolean', options: [], description: 'boolean'},
      choice: {key: 'choice', value: 'choice1', type: 'choice', options: ['choice1', 'choice2'], description: 'choice'},
      number: {key: 'number', value: 5, type: 'number', options: [], description: 'This is a important number'},
      text: {key: 'text', value: 'defaultText', type: 'string', options: [], description: 'text'}
    };

    const builder = new PipelineHtmlBuilder();

    return `
      <div class="drawflow-container parent-drawflow" style="overflow: unset">
        <div class="drawflow">
          <div class="parent-node">
            <div class="drawflow-node selected">
              <div class="inputs">
                <div class="input input_1"></div>
              </div>
              <div class="drawflow_content_node">
                ${builder.getHTML("xbauquet/Ginny", "Publish", data, ["main", "dev"])}
              </div>
              <div class="outputs">
                <div class="output output_1"></div>
                <div class="output output_2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  getPipelineNodeDelete() {
    const data = {
      boolean: {key: 'boolean', value: true, type: 'boolean', options: [], description: 'boolean'},
      choice: {key: 'choice', value: 'choice1', type: 'choice', options: ['choice1', 'choice2'], description: 'choice'},
      number: {key: 'number', value: 5, type: 'number', options: [], description: 'This is a important number'},
      text: {key: 'text', value: 'defaultText', type: 'string', options: [], description: 'text'}
    };

    const builder = new PipelineHtmlBuilder();

    return `
      <div class="drawflow-container parent-drawflow" style="overflow: unset">
        <div class="drawflow">
          <div class="parent-node">
            <div class="drawflow-node selected">
              <div class="inputs">
                <div class="input input_1"></div>
              </div>
              <div class="drawflow_content_node">
                ${builder.getHTML("xbauquet/Ginny", "Publish", data, ["main", "dev"])}
              </div>
              <div class="outputs">
                <div class="output output_1 active"></div>
                <div class="output output_2 active"></div>
              </div>
              <div class="drawflow-delete">x</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
