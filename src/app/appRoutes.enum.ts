import {Routes} from "@angular/router";
import {StyleComponent} from "./style/style.component";

export enum AppRoutes {
  STYLE = "style"
}

export const routes: Routes = [
  {path: AppRoutes.STYLE, component: StyleComponent}
];
