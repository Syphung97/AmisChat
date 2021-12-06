import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StringeeService } from 'src/app/core/services/stringee.service';

@Component({
  selector: 'amis-incomming-call',
  templateUrl: './incomming-call.component.html',
  styleUrls: ['./incomming-call.component.less']
})
export class IncommingCallComponent implements OnInit {

  // tslint:disable-next-line:variable-name
  _inComingCallObject;
  @Input() set inComingCallObject(data) {
    if (data) {
      this._inComingCallObject = data;

      const id = data.fromNumber;
      this.stringeeSV.getUserInfo([id], (status, code, message, users) => {
        const user = users[0];
        this._inComingCallObject.fromAlias = user.name;
        this._inComingCallObject.custom = { avatar: user.avatar };
      });
    }
  }
  fromAlias = "Lâm Minh Nguyệt";
  isVideoCall = true;
  @Output() closePopup = new EventEmitter();
  constructor(
    private stringeeSV: StringeeService
  ) { }

  ngOnInit(): void {
  }

  rejectCall(): void {
    this.closePopup.emit(false);
  }

  answerCall(): void {
    this.closePopup.emit(true);
  }
}
