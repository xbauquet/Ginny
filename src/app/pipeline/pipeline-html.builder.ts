import {Pipeline} from "./pipeline.model";

export class PipelineHtmlBuilder {
  getHTML(title: string, workflowName: string, data: any, branches: string[]) {
    let html = "<div>";
    html = html + `<div class="step-title">
                      <div>${workflowName}</div>
                      <div style="font-size: 0.8em; margin-left: 10px; color: #BBBBBB">${title}</div>
                      <div style="font-size: 0.8em; margin-left: 10px; color: #BBBBBB">fix: some kind of commit message</div>
                   </div>`;
    html = html + `</div>`;
    return html;
  }

  setEditionColors(pipeline: Pipeline) {
    if (!pipeline.pipeline) {
      return;
    }
    const steps = Object.values(pipeline.pipeline.drawflow.Home.data);
    steps.forEach(step => {
      this.removeClassFromSuccessOutput(step.class, "white-dot");
      this.removeClassFromFailureOutput(step.class, "white-dot");
      this.removeClassFromSuccessOutput(step.class, "yellow-dot");
      this.removeClassFromFailureOutput(step.class, "yellow-dot");
      this.removeTitleSuccess(step.class);
    });
    this.removeConnectionsColor();
  }

  setStaticColors(pipeline: Pipeline) {
    if (!pipeline.pipeline) {
      return;
    }
    this.setEditionColors(pipeline);
    const steps = Object.values(pipeline.pipeline.drawflow.Home.data);
    steps.forEach(step => {
      this.addClassToSuccessOutput(step.class, "white-dot");
      this.addClassToFailureOutput(step.class, "white-dot");
      this.removeTitleSuccess(step.class);
    });
    this.removeConnectionsColor();
  }

  private addClass(parentClass: string, elementClass: string, classToAdd: string) {
    const parent = document.getElementsByClassName(parentClass)[0];
    const element = parent.getElementsByClassName(elementClass)[0];
    element.classList.add(classToAdd);
  }

  private removeClass(parentClass: string, elementClass: string, classToAdd: string) {
    const parent = document.getElementsByClassName(parentClass)[0];
    const element = parent.getElementsByClassName(elementClass)[0];
    element.classList.remove(classToAdd);
  }

  removeClassFromSuccessOutput(parentClass: string, classToAdd: string) {
    this.removeClass(parentClass, "output_1", classToAdd);
  }

  removeClassFromFailureOutput(parentClass: string, classToAdd: string) {
    this.removeClass(parentClass, "output_2", classToAdd);
  }

  removeTitleSuccess(parentClass: string) {
    this.removeClass(parentClass, "step-title", "background-success");
  }

  removeConnectionsColor() {
    const connections = Array.from(document.getElementsByClassName("connection"));
    connections.forEach(c => {
      const element = c.getElementsByClassName('main-path')[0];
      element.classList.remove('green-stroke');
    });
  }

  addClassToSuccessOutput(parentClass: string, classToAdd: string) {
    this.addClass(parentClass, "output_1", classToAdd);
  }

  addClassToFailureOutput(parentClass: string, classToAdd: string) {
    this.addClass(parentClass, "output_2", classToAdd);
  }

  titleSuccess(parentClass: string) {
    this.addClass(parentClass, "step-title", "background-success");
  }

  colorConnection(stepInId: number, stepOutId: number) {
    const parent = document.getElementsByClassName('node_in_node-' + stepInId + " " + 'node_out_node-' + stepOutId)[0];
    const element = parent.getElementsByClassName('main-path')[0];
    element.classList.add('green-stroke');
  }
}
