import {Component} from '@angular/core';
import {Organisation} from "../old/usage/organisation.model";
import {ActionsBilling} from "../old/usage/actions-billing.model";

/**
 * Component displaying all the micro component.
 * This component is not made for the end user, it is a
 * tool for development and debug.
 */
@Component({
  selector: 'app-style',
  templateUrl: './style.component.html',
  styleUrls: ['./style.component.scss']
})
export class StyleComponent {
    fakeOrg() {
      return new Organisation(
        "",
        "Org name",
        "",
      "https://avatars.githubusercontent.com/u/8179943"
      );
    }

    fakeBilling() {
      return new ActionsBilling(
        2000,
        1200,
        0,
        {
          UBUNTU: 300,
          MAC: 800,
          WINDOWS: 100
        }
      )
    }
}
