import {Component, EventEmitter, Input, Output} from '@angular/core';
import {User} from "../../user/user.service";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {

  @Input() user!: User;
  @Input() small = false;
  @Output() logout = new EventEmitter<void>();

}
