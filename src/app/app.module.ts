import {NgModule, isDevMode} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatDividerModule} from "@angular/material/divider";
import {MatTooltipModule} from "@angular/material/tooltip";
import {NgOptimizedImage} from "@angular/common";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatDialogModule} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {StyleComponent} from './style/style.component';
import {RouterModule} from "@angular/router";
import {routes} from "./appRoutes.enum";
import {NavButtonComponent} from './micro-components/nav-button/nav-button.component';
import {SelectButtonComponent} from './micro-components/select-button/select-button.component';
import {ButtonComponent} from './micro-components/button/button.component';
import {ActionButtonComponent} from './micro-components/action-button/action-button.component';
import {LoaderComponent} from './micro-components/loader/loader.component';
import {DonutActionButtonComponent} from './micro-components/donut-action-button/donut-action-button.component';
import {RunRowComponent} from './ci-cd/run-row/run-row.component';
import {LoginComponent} from './login/login.component';
import {CiCdComponent} from './ci-cd/ci-cd.component';
import {WorkspaceCreationComponent} from './workspace/workspace-creation/workspace-creation.component';
import {
  WorkspaceRepositorySelectorComponent
} from './workspace/workspace-repository-selector/workspace-repository-selector.component';
import {WorkflowRunnerComponent} from './ci-cd/workflow-runner/workflow-runner.component';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {UsageComponent} from './usage/usage.component';
import {PipelineComponent} from './pipeline/pipeline.component';
import {SafeHtmlPipe} from './style/safe-html.pipe';
import { MainSectionComponent } from './main-section/main-section.component';
import { UserComponent } from './micro-components/user/user.component';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [
    AppComponent,
    StyleComponent,
    NavButtonComponent,
    SelectButtonComponent,
    ButtonComponent,
    ActionButtonComponent,
    LoaderComponent,
    DonutActionButtonComponent,
    RunRowComponent,
    LoginComponent,
    CiCdComponent,
    WorkspaceCreationComponent,
    WorkspaceRepositorySelectorComponent,
    WorkflowRunnerComponent,
    UsageComponent,
    PipelineComponent,
    SafeHtmlPipe,
    MainSectionComponent,
    UserComponent
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
    // https://stackoverflow.com/questions/75644587/angular-website-hosted-in-github-pages-does-not-work-if-i-refresh-in-any-route
    RouterModule.forRoot(routes, { useHash: true }),
    MatSnackBarModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
