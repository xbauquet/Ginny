import {WorkflowInputs} from "./workflow-inputs.model";

export class Workflow {
  constructor(public readonly badgeUrl: string,
              public readonly createdAt: Date,
              public readonly htmlUrl: string,
              public readonly id: string,
              public readonly name: string,
              public readonly path: string,
              public readonly state: string,
              public readonly updatedAt: Date,
              public readonly url: string,
              public sourceUrl: string,
              public readonly isDispatchable = false,
              public readonly inputs: WorkflowInputs[] = []
  ) {
  }
}
