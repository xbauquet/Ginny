import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatDividerModule} from "@angular/material/divider";
import {MatTooltipModule} from "@angular/material/tooltip";
import {NgOptimizedImage} from "@angular/common";
import {RepositorySelectorComponent} from './repository-selector/repository-selector.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {WorkflowRunnerComponent} from './workflow-runner/workflow-runner.component';
import {MatDialogModule} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RepoRefreshFrequencyComponent} from './repo-refresh-frequency/repo-refresh-frequency.component';
import {UsageComponent} from './oldUI/usage/usage/usage.component';
import {UsageChartComponent} from './oldUI/usage/usage-chart/usage-chart.component';
import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./login/login.component";
import {WorkspaceComponent} from './workspace/workspace.component';
import {WorkspaceCreatorComponent} from "./workspace/workspace-creator/workspace-creator.component";
import {CiCdComponent} from './ci-cd/ci-cd.component';
import {NavMenuComponent} from './nav-menu/nav-menu.component';
import {ActionButtonComponent} from './action-button/action-button.component';
import {CiCdRowComponent} from './ci-cd/ci-cd-row/ci-cd-row.component';
import {CreatePipelineComponent} from './pipeline/create-pipeline/create-pipeline.component';
import {PipelineComponent} from "./pipeline/pipeline.component";

const routes: Routes = [
  {path: '', redirectTo: '/CI-CD', pathMatch: 'full'},
  {path: 'CI-CD', component: CiCdComponent},
  {path: 'pipeline', component: PipelineComponent},

];

@NgModule({
  declarations: [
    AppComponent,
    RepositorySelectorComponent,
    WorkflowRunnerComponent,
    RepoRefreshFrequencyComponent,
    UsageComponent,
    UsageChartComponent,
    LoginComponent,
    WorkspaceComponent,
    WorkspaceCreatorComponent,
    CiCdComponent,
    NavMenuComponent,
    ActionButtonComponent,
    CiCdRowComponent,
    CreatePipelineComponent,
    PipelineComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule,
    NgOptimizedImage,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
