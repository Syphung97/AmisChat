import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'amis-popup-turnoff-notification-message',
  templateUrl: './popup-turnoff-notification-message.component.html',
  styleUrls: ['./popup-turnoff-notification-message.component.scss']
})
export class PopupTurnoffNotificationMessageComponent implements OnInit {

  constructor() { }
  radioValue = 'A';
  ngOnInit(): void {
  }

}
