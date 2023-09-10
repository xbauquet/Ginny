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
import {WorkspaceComponent} from './workspace/workspace.component';
import {WorkspaceCreatorComponent} from "./workspace/workspace-creator/workspace-creator.component";
import { CiCdComponent } from './ci-cd/ci-cd.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { ActionButtonComponent } from './action-button/action-button.component';
import { CiCdRowComponent } from './ci-cd/ci-cd-row/ci-cd-row.component';

const routes: Routes = [
  {path: '', redirectTo: '/CI-CD', pathMatch: 'full'},
  {path: 'CI-CD', component: CiCdComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RepositorySelectorComponent,
    RunListComponent,
    RunRowComponent,
    WorkflowRunnerComponent,
    PipelineComponent,
    RepoRefreshFrequencyComponent,
    UsageComponent,
    UsageChartComponent,
    LoginComponent,
    WorkspaceComponent,
    WorkspaceCreatorComponent,
    CiCdComponent,
    NavMenuComponent,
    ActionButtonComponent,
    CiCdRowComponent
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
