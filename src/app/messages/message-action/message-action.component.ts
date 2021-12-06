import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageActionConst } from '../constants/message-action';
import { Message } from '../models/Message';

@Component({
  selector: 'amis-message-action',
  templateUrl: './message-action.component.html',
  styleUrls: ['./message-action.component.scss']
})
export class MessageActionComponent implements OnInit {
  // tslint:disable-next-line:variable-name
  _msg!: Message;
  @Input() set msg(data) {
    this._msg = data;
  }
  // tslint:disable-next-line:variable-name
  _conv: any;
  @Input() set conv(data) {
    this._conv = data;
  }
  @Input() isOwner;

  @Output() actionGenerate = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  replyAction(): void {
    this.actionGenerate.emit({
      type: MessageActionConst.Reply,
      payload: this._msg
    });
  }

  forwardAction(): void {
    this.actionGenerate.emit({
      type: MessageActionConst.Forward,
      payload: this._msg
    });
  }

  copyAction(): void {
    this.actionGenerate.emit({
      type: MessageActionConst.Copy,
      payload: this._msg
    });
  }

  revokeAction(): void {
    this.actionGenerate.emit({
      type: MessageActionConst.Revoke,
      payload: this._msg
    });
  }

  deleteAction(): void {
    this.actionGenerate.emit({
      type: MessageActionConst.Delete,
      payload: this._msg
    });
  }
}
