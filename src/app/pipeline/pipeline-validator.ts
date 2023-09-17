import {DrawflowExport} from "drawflow";

export enum PipelineValidatorResult {
    UNDEFINED,
    TOO_MANY_STARTS,
    NO_START,
    VALID
}

export class PipelineValidator {
    static validate(pipeline: DrawflowExport | undefined): PipelineValidatorResult {
        if (!pipeline) {
            console.error("Pipeline is undefined");
            return PipelineValidatorResult.UNDEFINED;
        }
        const steps = Object.values(pipeline.drawflow.Home.data);

        let startingSteps = 0;

        for (let step of steps) {
            if (step.inputs["input_1"].connections.length === 0) {
                startingSteps = startingSteps + 1;
            }
        }

        if (startingSteps > 1) {
            console.error("More than one starting point");
            return PipelineValidatorResult.TOO_MANY_STARTS;
        }

        if (startingSteps < 1) {
            console.error("No starting point");
            return PipelineValidatorResult.NO_START;
        }

        return PipelineValidatorResult.VALID;
    }
}
