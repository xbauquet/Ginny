import {Component, HostListener, OnInit} from '@angular/core';
import {ContextService} from "./context.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private contextService: ContextService) {
  }

  ngOnInit() {
    this.contextService.setSmallScreen(window.innerWidth < 1024);
  }

  @HostListener("window:resize", []) onResize() {
    this.contextService.setSmallScreen(window.innerWidth < 1024);
  }
}
