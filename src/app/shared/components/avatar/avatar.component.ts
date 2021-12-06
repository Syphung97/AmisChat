import { Component, Input, OnInit } from '@angular/core';
import { CommonFn } from 'src/app/core/functions/commonFn';
import { UserService } from 'src/app/core/services/users/user.service';
import { StorageConstant } from '../../constant/storage-constant';

@Component({
  selector: 'amis-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {

  @Input() size!: number;

  @Input() gap!: number;

  // tslint:disable-next-line:variable-name
  _stringeeUserID!: string;
  @Input() set stringeeUserID(data) {
    if (this.useFor == "User") {
      this._stringeeUserID = data;
      this.getAvatar();
    }
  }

  @Input() useFor = "User";

  @Input() parent;

  // tslint:disable-next-line:variable-name
  _conv: any;
  @Input() set conv(data) {
    this._src = "";
    if (data) {

      this._conv = data;

      this.getAvatar();
    }
  }
  // tslint:disable-next-line:variable-name
  _src = "";
  @Input() set src(data) {
    if (data) {

      this._src = data;
    }
  }

  @Input() isCircle!: boolean;

  constructor() { }

  ngOnInit(): void {

  }

  getAvatar(): void {
    try {
      const listUserString = CommonFn.getCacheStringeeUser();
      if (listUserString && listUserString != "" && !this._src) {
        const stringeeUsers = JSON.parse(listUserString);
        if (this.useFor == "User") {
          this._src = stringeeUsers?.find(e => e.StringeeUserID == this._stringeeUserID)?.AvatarUrl;
        }
        else if (this.useFor == "Conv") {
          this.getAvatarForConv(stringeeUsers);
        }
      }

    } catch (error) {
      console.log(error);
    }
  }


  getAvatarForConv(stringeeUsers): void {
    try {
      const listParticipant = this._conv.participants;
      if (!this._conv.isGroup) {
        // nếu trùng user đang đăng nhập thì gán tên hội thoại name
        if (this._conv.creator == UserService.UserInfo.StringeeUserID) {
          const displayUser = listParticipant.find(d => d.userId != this._conv.creator);
          this._src = stringeeUsers?.find(e => e.StringeeUserID == displayUser.userId)?.AvatarUrl;
        }
        // nếu ko trùng user đang đăng nhâp thì gán bằng người tạo
        else if (this._conv.creator != UserService.UserInfo.StringeeUserID) {
          const displayUser = listParticipant.find(d => d.userId == this._conv.creator);
          this._src = stringeeUsers?.find(e => e.StringeeUserID == displayUser.userId)?.AvatarUrl;
        }
      }
      // check hội thoại nhóm
      else if (this._conv.isGroup) {

      }
    } catch (error) {
      CommonFn.logger(error);
    }
  }


}
