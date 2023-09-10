import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-screenshot',
  templateUrl: './screenshot.component.html',
  styleUrls: ['./screenshot.component.scss']
})
export class ScreenshotComponent {
  @Input() imagePath!: string;
  @Input() icon!: string;
  @Input() title!: string;
  @Input() message!: string;
}
