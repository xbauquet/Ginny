import {Repository} from "./repository.model";
import {Workflow} from "./workflow.model";
import {Run} from "./run.model";

export interface RepoRun {
  repo: Repository;
  workflowRun: { workflow: Workflow, runs: Run[] }[];
}
