import {Repository} from "../repository.model";
import {Workflow} from "../ci-cd/workflow.model";

export class PipelineData {
  constructor(public stepUUID: string,
              public repo: Repository,
              public workflow: Workflow,
              public branches: string[] = [],
              public inputs: any,
              public branch: string = 'main') {
  }
}
