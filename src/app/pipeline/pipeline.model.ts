import {DrawflowExport} from "drawflow";

export class Pipeline {
  constructor(public name: string,
              public pipeline?: DrawflowExport) {
  }
}
