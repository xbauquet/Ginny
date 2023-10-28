import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-nav-button',
  templateUrl: './nav-button.component.html',
  styleUrls: ['./nav-button.component.scss']
})
export class NavButtonComponent {
  @Input() icon!: string;
  @Input() title!: string;
  @Input() selected = false;
  @Input() small = false;
}
