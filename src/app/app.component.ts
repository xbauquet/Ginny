import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {ContextService} from "./context.service";
import {GithubApiService} from "./github-api.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChild('pipelineContainer') pipelineContainer!: ElementRef;

  isLoggedIn = false;
  showRunList = true;
  showPipeline = true;

  private pipelineWidthKey = "pipelineWidthKey";
  private resizingEvent = {
    isResizing: false,
    startingCursorX: 0,
    startingWidth: 0,
  };

  constructor(private contextService: ContextService,
              private githubApiService: GithubApiService) {
    this.githubApiService.isLoggedIn.subscribe(v => this.isLoggedIn = v);
    this.contextService.showPipelines.subscribe(v => this.showPipeline = v);
    this.contextService.showRuns.subscribe(v => this.showRunList = v);
  }

  ngOnInit() {
    this.contextService.setSmallScreen(window.innerWidth < 1024);
  }

  @HostListener("window:resize", []) onResize() {
    this.contextService.setSmallScreen(window.innerWidth < 1024);
  }


  //_______________________________________________________________________________
  // Resizable pipeline container
  //_______________________________________________________________________________
  ngAfterViewInit() {
    const pipelineWidth = localStorage.getItem(this.pipelineWidthKey);
    if (pipelineWidth) {
      this.pipelineContainer.nativeElement.style.width = pipelineWidth;
    } else {
      this.pipelineContainer.nativeElement.style.width = "70%";
    }
  }

  startResizingPipeline(event: MouseEvent) {
    this.resizingEvent = {
      isResizing: true,
      startingCursorX: event.clientX,
      startingWidth: this.pipelineContainer.nativeElement.offsetWidth,
    };
  }

  @HostListener('window:mousemove', ['$event'])
  updatePipelineSize(event: MouseEvent) {
    if (!this.resizingEvent.isResizing) {
      return;
    }
    const cursorDeltaX = event.clientX - this.resizingEvent.startingCursorX;
    const newWidth = this.resizingEvent.startingWidth - cursorDeltaX;
    this.pipelineContainer.nativeElement.style.width = newWidth + "px";
  }

  @HostListener('window:mouseup')
  stopResizing() {
    this.resizingEvent.isResizing = false;
    localStorage.setItem(this.pipelineWidthKey, this.pipelineContainer.nativeElement.style.width);
  }
}
