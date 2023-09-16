import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss']
})
export class ActionButtonComponent {
  @Input() icon!: string;
  @Input() title!: string;
  @Input() selected = false;
}
