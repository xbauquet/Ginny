import {Component} from '@angular/core';
import {ContextService} from "./old/context.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private theme: "light" | "dark" = "light";

  constructor(private contextService: ContextService) {
    this.contextService.theme.subscribe(v => this.applyTheme(v));
  }

  private applyTheme(newTheme: "light" | "dark") {
    this.theme = newTheme;
    document.body.classList.remove("dark");
    document.body.classList.remove("light");
    document.body.classList.add(newTheme);
  }
}
