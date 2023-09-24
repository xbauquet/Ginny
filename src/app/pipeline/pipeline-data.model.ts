import {Repository} from "../github-api/repository.model";
import {Workflow} from "../github-api/workflow.model";

export class PipelineData {
  constructor(public stepUUID: string,
              public repo: Repository,
              public workflow: Workflow,
              public branches: string[] = [],
              public inputs: any,
              public branch: string = 'main') {
  }
}
