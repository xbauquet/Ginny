export class WorkflowInputs {
  constructor(public readonly key: string,
              public readonly description: string,
              public readonly required: boolean,
              public readonly type: string,
              public readonly defaultValue?: string,
              public readonly options: string[] = []) {
  }
}
