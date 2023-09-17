export class PipelineHtmlBuilder {

    /******************************************
     HTML
     ******************************************/
    getHTML(title: string, workflowName: string, data: any, branches: string[]) {
        return `
      <div>
        <div class="step-title">
            <div class="h2">${workflowName}</div>
            <div class="h3">${title}</div>
        </div>

        <div class="step-input-container">
            <div class="box">
                <div class="light-text">branch</div>
                <select class="step-input" df-inputs-branch>
                    ${this.getBranchOptions(branches, 'main')}
                </select>
            </div>

            ${this.getInputs(data)}
        </div>
      </div>
    `;
    }

    private getBranchOptions(options: string[], defaultBranch: string): string {
        let html = "";
        for (let option of options) {
            html += `<option value="${option}"
                       selected="${option === defaultBranch}">${option}</option>`;
        }
        return html;
    }

    private getInputs(data: any) {
        let html = "";
        if (data) {
            const keys = Object.keys(data);
            for (let key of keys) {
                if (data[key].type === 'boolean') {
                    html += this.getBooleanInput(key, data);
                } else if (data[key].type === 'choice') {
                    html += this.getChoiceInput(key, data);
                } else if (data[key].type === 'string') {
                    html += this.getStringInput(key, data);
                } else if (data[key].type === 'number') {
                    html += this.getNumberInput(key, data);
                }
            }
        }
        return html;
    }

    private getBooleanInput(key: string, data: any) {
        return `
      <div class="box">
        <div class="light-text">${key}</div>
        <input type="checkbox" value="${data[key].value}" df-inputs-${key}-value>
      </div>
    `;
    }

    private getStringInput(key: string, data: any) {
        return `
            <div class="box">
                <div class="light-text">${key}</div>
                <input class="step-input" type="text" value="${data[key].value}" df-inputs-${key}-value>
            </div>
          `;
    }

    private getChoiceInput(key: string, data: any) {
        return `
            <div class="box">
                <div class="light-text">${key}</div>
                <select class="step-input" df-inputs-${key}-value>
                    ${this.getChoiceOptions(key, data)}
                </select>
            </div>
    `;
    }

    private getChoiceOptions(key: string, data: any) {
        let html = "";
        for (let option of data[key].options) {
            html += `<option value="${option}" selected="${option === data[key].value}">${option}</option>`;
        }
        return html;
    }

    private getNumberInput(key: string, data: any) {
        return `
        <div class="box">
            <div class="light-text" title="${key} \n ${data.desciption}">${key}</div>
            <input class="step-input" type="number" value="${data[key].value}" df-inputs-${key}-value>
        </div>
        `;
    }

    /******************************************
     Modifier
     ******************************************/
    onStepStarted(id: string) {
        this.addClass(id, "input_1", 'active');
    }

    onStepSuccess(id: string) {
        this.addClass(id, "output_1", 'active');
    }

    onStepFailed(id: string) {
        this.addClass(id, "output_2", 'active');
    }

    onNextStep(stepInId: number, stepOutId: number) {
        this.colorConnection(stepInId, stepOutId);
    }

    resetPipelineColor() {
        this.removeStepColors();
        this.removeConnectionsColor();
    }

    private removeStepColors() {
        const inputs = Array.from(document.getElementsByClassName("input"));
        inputs.forEach(i => i.classList.remove('active'));
        const outputs = Array.from(document.getElementsByClassName("output"));
        outputs.forEach(o => o.classList.remove('active'));
    }

    private removeConnectionsColor() {
        const connections = Array.from(document.getElementsByClassName("connection"));
        connections.forEach(c => {
            const element = c.getElementsByClassName('main-path')[0];
            element.classList.remove('green-stroke');
        });
    }

    private addClassToSuccessOutput(parentClass: string, classToAdd: string) {
        this.addClass(parentClass, "output_1", classToAdd);
    }

    private addClassToFailureOutput(parentClass: string, classToAdd: string) {
        this.addClass(parentClass, "output_2", classToAdd);
    }

    colorConnection(stepInId: number, stepOutId: number) {
        const parent = document.getElementsByClassName('node_in_node-' + stepInId + " " + 'node_out_node-' + stepOutId)[0];
        const element = parent.getElementsByClassName('main-path')[0];
        element.classList.add('green-stroke');
    }

    private addClass(parentClass: string, elementClass: string, classToAdd: string) {
        const parent = document.getElementsByClassName(parentClass)[0];
        console.log(parent);
        const element = parent.getElementsByClassName(elementClass)[0];
        console.log(element)
        element.classList.add(classToAdd);
    }

    private removeClass(parentClass: string, elementClass: string, classToAdd: string) {
        const parent = document.getElementsByClassName(parentClass)[0];
        const element = parent.getElementsByClassName(elementClass)[0];
        element.classList.remove(classToAdd);
    }
}
