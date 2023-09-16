import {NgModule} from '@angular/core';
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
import { NavButtonComponent } from './micro-components/nav-button/nav-button.component';
import { SelectButtonComponent } from './micro-components/select-button/select-button.component';
import { ButtonComponent } from './micro-components/button/button.component';
import { ActionButtonComponent } from './micro-components/action-button/action-button.component';
import { LoaderComponent } from './micro-components/loader/loader.component';
import { DonutActionButtonComponent } from './micro-components/donut-action-button/donut-action-button.component';
import { RunRowComponent } from './run-row/run-row.component';
import { LoginComponent } from './login/login.component';
import { CiCdComponent } from './ci-cd/ci-cd.component';

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
    CiCdComponent
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
