import {Component, Input} from '@angular/core';
import {ButtonComponent} from "../button/button.component";

@Component({
  selector: 'app-select-button',
  templateUrl: './select-button.component.html',
  styleUrls: ['./select-button.component.scss']
})
export class SelectButtonComponent extends ButtonComponent {
  @Input() small = false;
}
