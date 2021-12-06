import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/users/user.service';
import { MessageStatus } from '../enums/message-status.enum';

import { Message } from '../models/Message';

@Component({
  selector: 'amis-read-receipt',
  templateUrl: './read-receipt.component.html',
  styleUrls: ['./read-receipt.component.less']
})
export class ReadReceiptComponent implements OnInit {

  MessageType = MessageStatus;
  // tslint:disable-next-line:variable-name
  _msg!: Message;

  @Input() set msg(data) {
    this._msg = data;
  }
  // tslint:disable-next-line:variable-name
  _conv: any;
  @Input() set conv(data) {
    this._conv = data;
    this.getReceiverUser();
  }

  receiverUer;
  constructor() { }

  ngOnInit(): void {
  }
  log(e): void {
    console.log(e);
  }

  getReceiverUser(): void {
    if (!this._conv?.isGroup) {
      this.receiverUer = this._conv?.participants?.find(e => e.userId != UserService.UserInfo.StringeeUserID);
    }
  }
}
