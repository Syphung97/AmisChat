import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { element } from 'protractor';
import { BehaviorSubject } from 'rxjs';
import { PagingRequest } from 'src/app/core/models/PagingRequest';
import { AvatarService } from 'src/app/core/services/users/avatar.service';
import { UserService } from 'src/app/core/services/users/user.service';
@Component({
  selector: 'amis-conversation-select-user',
  templateUrl: './conversation-select-user.component.html',
  styleUrls: ['./conversation-select-user.component.less']
})
export class ConversationSelectUserComponent implements OnInit {

  @Output() onSelectUser = new EventEmitter();

  selectedUser!: string;

  delayTime = 500;

  listDirectory: any;

  pagingRequest = new PagingRequest();

  isLoading = true;

  timeOutSearch: any;

  listUser: any;

  listSelectedUser = new Array<any>();

  _valueSearch!: string;

  currentUserSelected: any;

  notData = "Không tìm thấy liên hệ.";

  constructor(
    private userSV: UserService,
    private avatarSV: AvatarService
  ) { }

  ngOnInit(): void {
    this.pagingRequest.PageIndex = 1;
    this.pagingRequest.PageSize = 20;
    this.getUserFromSystem();
    //this.listUserSelect = [];

  }

  getAvatar(avatarToken: any, userID: any, editVersion: any = new Date()): string {

    return this.avatarSV.getAvatar(avatarToken, userID, editVersion, true, 80, 80);
  }

  getUserFromSystem(): void {
    this.isLoading = true;
    this.userSV.getUserFromSystem(this.pagingRequest).subscribe(data => {
      this.isLoading = false;
      if (data?.Success) {
        const pageData = data.Data.PageData;
        pageData.forEach(e => {
          e.Avatar = this.getAvatar(e.AvatarToken, e.UserID, e.EditVersion);
        });
        this.listDirectory = pageData;
      }

    });
  }



  /**
   *
   * @param value
   * tìm kiếm người dùng
   * DVQuang2 13/05/2021
   */
  onSearch(value: string): void {
    this._valueSearch = encodeURI(value.trim());
    this.pagingRequest.Filter = window.btoa(`[[["FullName","contains","${this._valueSearch}"],"or",["EmployeeCode","contains","${this._valueSearch}"],"or",["Mobile","contains","${this._valueSearch}"],"or",["ContactEmail","contains","${this._valueSearch}"]], "AND", ["Status","=","3"]]`);
    this.pagingRequest.PageIndex = 1;
    this.pagingRequest.PageSize = 20;
    this.pagingRequest.Sort = window.btoa(`[{"selector":"FullName","desc":"false"}]`);
    clearTimeout(this.timeOutSearch);

    this.timeOutSearch = setTimeout(() => {
      if (this._valueSearch != null) {
        this.isLoading = true;
        this.getUserFromSystem();
      }
    }, this.delayTime);
  }



  /**
   *
   * @param value Chọn user
   * dvquang2
   */
  selectUser(value: any): void {
    this.isLoading = true;
    value.forEach(element => {
      const listSelectedUserID = this.listSelectedUser.map(e => e.StringeeUserID);
      if (!listSelectedUserID.includes(element)) {
        const userSelected = this.listDirectory.filter(e => e.StringeeUserID == element);
        if (userSelected?.length) {
          this.listSelectedUser.push(userSelected[0]);

        }
      }
    });
    for (let index = 0; index < this.listSelectedUser.length; index++) {
      const element = this.listSelectedUser[index].StringeeUserID;
      if (!value.includes(element)) {
        this.listSelectedUser.splice(index, 1);
        index--;
      }
    }

    this.onSelectUser.emit(this.listSelectedUser);

  }


  /**
   *
   * @param value
   * @returns
   */
  isNotSelected(value: string): boolean {
    return this.selectedUser.indexOf(value) === -1;
  }



}
