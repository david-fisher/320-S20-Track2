import { Component } from '@angular/core';

@Component({
  selector: 'app-click-me',
  template: `
    <button mat-raised-button color="primary" (click)="onClickMe()">Submit!</button>
    {{clickMessage}}`,
  styleUrls: ['./app.component.css']
})
export class ClickMeComponent {
  clickMessage = '';

  onClickMe() {
    const Messages = ['Wow!', 'Woah!', 'Meh.', 'Nifty(?)', 'Does not actually submit anything though...'];
    this.clickMessage = Messages[Math.floor(Math.random() * Messages.length)];
  }
}
