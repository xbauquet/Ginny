import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ContextService {

  private themeKey = "ginny-theme";
  private showPipelineKey = "ginny-show-pipelines";
  private showRunsKey = "ginny-show-runs";
  private showUsageKey = "ginny-show-usage";

  theme = new BehaviorSubject<'light' | 'dark'>('light');
  smallScreen = new BehaviorSubject(false);
  showPipelines = new BehaviorSubject(true);
  showRuns = new BehaviorSubject(true);
  showUsage = new BehaviorSubject(true);

  constructor() {
    this.initTheme();
    this.initBoolean(this.showPipelineKey, this.showPipelines);
    this.initBoolean(this.showRunsKey, this.showRuns);
    this.initBoolean(this.showUsageKey, this.showUsage);
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

  setSmallScreen(isSmall: boolean) {
    this.smallScreen.next(isSmall);
  }

  toggleShowPipelines() {
    this.toggleBoolean(this.showPipelineKey, this.showPipelines);
  }

  toggleShowRuns() {
    this.toggleBoolean(this.showRunsKey, this.showRuns);
  }

  toggleShowUsage() {
    this.toggleBoolean(this.showUsageKey, this.showUsage);
  }

  private toggleBoolean(key: string, behaviour: BehaviorSubject<boolean>) {
    const value = localStorage.getItem(key) ?? 'true';
    const boolValue = value === 'true';
    localStorage.setItem(key, "" + (!boolValue));
    behaviour.next(!boolValue);
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

  private initBoolean(key: string, behaviour: BehaviorSubject<boolean>) {
    let value = localStorage.getItem(key);
    if (value !== null && (value === 'true' || value === 'false')) {
      behaviour.next(value === 'true');
    } else {
      localStorage.setItem(key, 'true');
      behaviour.next(true);
    }
  }
}
