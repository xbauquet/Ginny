import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatDividerModule} from "@angular/material/divider";
import {MatTooltipModule} from "@angular/material/tooltip";
import {NgOptimizedImage} from "@angular/common";
import {WorkspaceSelectorComponent} from './workspace/workspace-selector/workspace-selector.component';
import {LoginComponent} from './login/login.component';
import {RepositorySelectorComponent} from './workspace/repository-selector/repository-selector.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {RunListComponent} from './runs/run-list/run-list.component';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {RunRowComponent} from './runs/run-row/run-row.component';
import {WorkflowRunnerComponent} from './runs/workflow-runner/workflow-runner.component';
import {MatDialogModule} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PipelineComponent} from './pipeline/pipeline/pipeline.component';
import {RepoRefreshFrequencyComponent} from './header/repo-refresh-frequency/repo-refresh-frequency.component';
import {UsageComponent} from './usage/usage/usage.component';
import {UsageChartComponent} from './usage/usage-chart/usage-chart.component';
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    WorkspaceSelectorComponent,
    LoginComponent,
    RepositorySelectorComponent,
    RunListComponent,
    RunRowComponent,
    WorkflowRunnerComponent,
    PipelineComponent,
    RepoRefreshFrequencyComponent,
    UsageComponent,
    UsageChartComponent
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
