import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {HeaderComponent} from './oldUI/header/header.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatDividerModule} from "@angular/material/divider";
import {MatTooltipModule} from "@angular/material/tooltip";
import {NgOptimizedImage} from "@angular/common";
import {WorkspaceSelectorComponent} from './oldUI/workspace/workspace-selector/workspace-selector.component';
import {RepositorySelectorComponent} from './oldUI/workspace/repository-selector/repository-selector.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {RunListComponent} from './oldUI/runs/run-list/run-list.component';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {RunRowComponent} from './oldUI/runs/run-row/run-row.component';
import {WorkflowRunnerComponent} from './oldUI/runs/workflow-runner/workflow-runner.component';
import {MatDialogModule} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PipelineComponent} from './oldUI/pipeline/pipeline/pipeline.component';
import {RepoRefreshFrequencyComponent} from './oldUI/header/repo-refresh-frequency/repo-refresh-frequency.component';
import {UsageComponent} from './oldUI/usage/usage/usage.component';
import {UsageChartComponent} from './oldUI/usage/usage-chart/usage-chart.component';
import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./login/login.component";

const routes: Routes = [];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    WorkspaceSelectorComponent,
    RepositorySelectorComponent,
    RunListComponent,
    RunRowComponent,
    WorkflowRunnerComponent,
    PipelineComponent,
    RepoRefreshFrequencyComponent,
    UsageComponent,
    UsageChartComponent,
    LoginComponent
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
