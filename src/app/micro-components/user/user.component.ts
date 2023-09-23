import {Component, EventEmitter, Input, Output} from '@angular/core';
import {User} from "../../github-api/user.model";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {

  @Input() user!: User;
  @Output() logout = new EventEmitter<void>();

}
