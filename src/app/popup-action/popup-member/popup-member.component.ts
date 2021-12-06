import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { UserOnline } from 'src/app/shared/models/stringee-model/UserOnline';
import { HttpService } from 'src/app/core/services/http.service';

import { UserService } from 'src/app/core/services/users/user.service';
import { CommonFn } from 'src/app/core/functions/commonFn';
@Component({
  selector: 'amis-popup-member',
  templateUrl: './popup-member.component.html',
  styleUrls: ['./popup-member.component.scss']
})
export class PopupMemberComponent implements OnInit {

  constructor(
    private httpService: HttpService
  ) { }
  @Input() isVisible = true;
  listUserOnline: any;
  _conversation: any;


  @Input() isPopupDeleteMember!: boolean;
  @Output() isPopupMember = new EventEmitter();
  user: any;
  currentUser!: any;
  @Input() set conversation(data) {
    if (data) {
      this.listUserOnline = UserService.UserOnline;
      data.participants.forEach(e => {
        e.name = CommonFn.getUserByStringeeID(e.userId)?.DisplayName;
      });
      this._conversation = data;
      this.users = this._conversation?.participants;
      this.checkConversationOnline(this.users);
      this.creator = this._conversation?.creator;
      this._conversation?.participants?.forEach(element => {
        if (element.userId == this.creator) {
          this.admin = element;
        }
      });

    }
  }
  users: any;
  creator = '';
  admin!: any;


  ngOnInit(): void {
    this.currentUser = UserService.UserInfo.StringeeUserID;


  }


  closePopup(isVisible: any): void {
    this.isVisible = isVisible;
    this.isPopupMember.emit(false);
  }
  openDialogDeleteGroup(user: any): void {
    this.isPopupDeleteMember = true;
    this.user = user;
  }
  onchangeVisiablePopupDelete(isPopupMember: any): void {
    this.isPopupDeleteMember = isPopupMember;
  }

  /**
   * làm mới lại danh sách thành viên sau khi xóa
   * @param userDelete
   * dvquang2 31/05/2021
   */
  reloadMember(userDelete: any) {
    try {
      for (let index = 0; index < this.users.length; index++) {
        const element = this.users[index].userId;
        if (userDelete.userId == element) {
          this.users.splice(index, 1);
          index--;
        }
      }
    } catch (error) {
      CommonFn.logger(error);
    }

  }

  getUserOnline(): void {
    const endPoint = `https://api.stringee.com/v1/users`;
    const option = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-STRINGEE-AUTH': 'eyJjdHkiOiJzdHJpbmdlZS1hcGk7dj0xIiwidHlwIjoiSldUIiwiYWxnIjoiSFMyNTYifQ.eyJqdGkiOiJTSzJtZ1Bncjg3TlZhTERENE90UlZacEltY3R6Ykp4c0ktMTYyMzAzMjc2MCIsImlzcyI6IlNLMm1nUGdyODdOVmFMREQ0T3RSVlpwSW1jdHpiSnhzSSIsImV4cCI6MTYyNTYyNDc2MCwicmVzdF9hcGkiOnRydWV9.-1pcyflFoBJk_EEexlzQQRm7tdHlL3Ywwa3-Hv5hFMM'
      })
    };
    this.httpService.get<UserOnline>(endPoint, option).subscribe(data => {
      this.listUserOnline = data.users;
    });

  }
  /**
   * check user online cho các member có trong nhóm
   * @param part
   * DVQUANG2 08/06/2021
   */
  checkConversationOnline(part: any): void {
    try {
      part.forEach(element => {
        this.listUserOnline?.forEach((you: any) => {
          if (element.userId == you.userId) {
            element.status = 1;
          }
        });
      });

    } catch (error) {
      CommonFn.logger(error);
    }
  }
}
