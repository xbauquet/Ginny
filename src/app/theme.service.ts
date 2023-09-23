import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private themeKey = "ginny-theme";

  theme = new BehaviorSubject<'light' | 'dark'>('light');

  constructor() {
    this.initTheme();
  }

  /**
   * Toggle theme between light and dark
   */
  toggleTheme() {
    const newTheme = localStorage.getItem(this.themeKey) === "dark" ? "light" : "dark";
    this.applyTheme(newTheme);
  }

  /**
   * Set theme according to the saved value in the localstorage
   */
  private initTheme() {
    const theme = localStorage.getItem(this.themeKey);
    const newTheme = theme && (theme === 'light' || theme === 'dark') ? theme : "light";
    this.applyTheme(newTheme);
  }

  /**
   * Save the newTheme in the localstorage and apply it to the html
   */
  private applyTheme(newTheme: "light" | "dark") {
    localStorage.setItem(this.themeKey, newTheme);
    this.theme.next(newTheme);
    document.body.classList.remove("dark");
    document.body.classList.remove("light");
    document.body.classList.add(newTheme);
  }
}
