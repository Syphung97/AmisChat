import { Component, Input, OnInit } from '@angular/core';
import { CommonFn } from 'src/app/core/functions/commonFn';
import { UserService } from 'src/app/core/services/users/user.service';
import { StorageConstant } from '../../constant/storage-constant';

@Component({
  selector: 'amis-avatar-group',
  templateUrl: './avatar-group.component.html',
  styleUrls: ['./avatar-group.component.less']
})
export class AvatarGroupComponent implements OnInit {
  @Input() size = 48;

  @Input() conv: any;
  // tslint:disable-next-line:variable-name
  _paticipant = new Array<any>();
  @Input() set paticipant(data) {


    this._paticipant = data;
    this.getAvatarForConv();
  }

  firstImg = "https://avatars.githubusercontent.com/u/37412232?v=4";

  secondImg = "https://avatars.githubusercontent.com/u/37786962?v=4";

  constructor() { }

  ngOnInit(): void {
  }


  handleImage(): void {
    try {
      const listImg = this._paticipant?.map(e => e.avatar);
      if (listImg?.length) {

        this.firstImg = listImg[0];
        this.secondImg = listImg.length > 1 ? listImg[1] : null;
      }

    } catch (error) {
      CommonFn.logger(error);
    }
  }

  getAvatarForConv(): void {
    try {
      const listUserString = CommonFn.getCacheStringeeUser();
      if (listUserString && listUserString != "") {
        const stringeeUsers = JSON.parse(listUserString);
        // check hội thoại nhóm

        const listUserID = this._paticipant?.map(e => e.userId);
        if (listUserID?.length) {

          this.firstImg = stringeeUsers.find(e => e.StringeeUserID == listUserID[0]).AvatarUrl;
          this.secondImg = listUserID.length > 1 ? stringeeUsers.find(e => e.StringeeUserID == listUserID[1]).AvatarUrl : null;
        }

      }



    } catch (error) {
      CommonFn.logger(error);
    }
  }

}
