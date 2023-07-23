import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ContextService {

  private themeKey = "ginny-theme";

  theme = new BehaviorSubject<'light' | 'dark'>('light');

  constructor() {
    this.initTheme();
  }

  private initTheme() {
    const theme = localStorage.getItem(this.themeKey);
    if (theme && (theme === 'light' || theme === 'dark')) {
      this.theme.next(theme);
    } else {
      localStorage.setItem(this.themeKey, "light");
      this.theme.next("light");
    }
  }

  toggleTheme() {
    if (localStorage.getItem(this.themeKey) === "dark") {
      localStorage.setItem(this.themeKey, "light");
      this.theme.next("light");
    } else {
      localStorage.setItem(this.themeKey, "dark");
      this.theme.next("dark");
    }
  }
}
