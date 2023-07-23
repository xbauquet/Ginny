import {Component} from '@angular/core';
import {ContextService} from "../context.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  // Current app color theme
  theme = "light";

  constructor(private contextService: ContextService) {
    this.contextService.theme.subscribe(this.applyTheme);
  }

  /**
   * Change the current app current theme
   */
  toggleTheme() {
    this.contextService.toggleTheme();
  }

  private applyTheme(newTheme: string) {
    this.theme = newTheme;
    document.body.classList.remove("dark");
    document.body.classList.remove("light");
    document.body.classList.add(newTheme);
  }
}
