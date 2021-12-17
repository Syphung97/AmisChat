import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { UserService } from 'src/app/core/services/users/user.service';
import { AvatarService } from 'src/app/core/services/users/avatar.service';
import { PagingRequest } from 'src/app/core/models/PagingRequest';
import { StringeeService } from 'src/app/core/services/stringee.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { of } from 'rxjs';
import { CommonFn } from 'src/app/core/functions/commonFn';
import { AmisTranslationService } from 'src/app/core/services/amis-translation-service.service';
import { Participant } from 'src/app/shared/models/participant';
import { ConversationService } from 'src/app/conversation/services/conversation.service';
import {OrganizationUnitService} from 'src/app/core/services/organization-unit.service'
import { FormMode } from 'src/app/core/models/FormMode';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';
@Component({
  selector: 'amis-popup-add-user',
  templateUrl: './popup-add-user.component.html',
  styleUrls: ['./popup-add-user.component.scss'],
})
export class PopupAddUserComponent implements OnInit {
  constructor(
    private userSV: UserService,
    private avatarSV: AvatarService,
    private stringeeService: StringeeService,
    private nzMessage: NzMessageService,
    private translateSV: AmisTranslationService,
    private conversationSV: ConversationService,
    private organizationSV: OrganizationUnitService
  ) { }

  // nhận input từ siders
  @Input() conversation: any;
  pagingRequest = new PagingRequest();
  listDirectory = new Array();
  // check lựa chọn
  checked = false;
  allChecked = false;
  // đếm số bản ghi đã chọn
  countUser = 0;
  // danh bạ
  listUserSelected: any;
  // input trong ô search
  inputValue = '';
  // thời gian delay search
  timeOutSearch: any;
  delayTime = 500;


  @Input() isVisible = true;

  @Output() isPopupAddMember = new EventEmitter();


  ngOnInit(): void {
    this.pagingRequest.Filter = window.btoa(
      `[["Status","=","3"]]`
    );
    this.pagingRequest.PageIndex = 1;
    this.pagingRequest.PageSize = 20;
    this.pagingRequest.Sort = window.btoa(`[{"selector":"FullName","desc":"false"}]`);
    this.getUserFromSystem(undefined);

    this.listUserSelected = [];
  }

  /**
   *
   * @param user chọn từng user
   * DVQuang2 update 27/05/2021
   */
  selectedItems(user: any, stringeeUserID: string): void {
    try {
      user.checked = !user.checked;
      if (user.checked === true) {
        this.countUser += 1;
        this.listUserSelected.push(user);
      } else {
        this.countUser -= 1;
        const res = this.listUserSelected.filter(
          (obj) => obj.StringeeUserID != stringeeUserID
        );
        this.listUserSelected = res;
      }
    } catch (error) {
      CommonFn.logger(error);
    }
  }

  /**
   * chọn all user
   * DVQuang2
   */
  selectAll(): void {
    try {
      this.listDirectory.forEach((element) => {
        if (element.checked === true) {
          element.checked = true;
        } else {
          element.checked = true;
        }

        this.countUser = this.listDirectory.length;

        if (this.allChecked === false) {
          element.checked = false;
          this.countUser = 0;
        }
      });
    } catch (error) {
      CommonFn.logger(error);
    }
  }

  close(): void {
    this.isVisible = false;
    this.isPopupAddMember.emit(false);
  }

  closePopup(isVisible: any): void {
    this.isVisible = isVisible;
    this.isPopupAddMember.emit(false);
  }

  getAvatar(
    avatarToken: any,
    userID: any,
    editVersion: any = new Date()
  ): string {
    return this.avatarSV.getAvatar(
      avatarToken,
      userID,
      editVersion,
      true,
      80,
      80
    );
  }

  getUserFromSystem(callback: Function | undefined): void {
    try {
      this.userSV.getUserFromSystem(this.pagingRequest).subscribe((data) => {
        //this.isLoading = false;
        if (data?.Success) {
          if (!callback) {
            const pageData = data.Data.PageData;
            pageData.forEach((e) => {
              e.Avatar = this.getAvatar(e.AvatarToken, e.UserID, e.EditVersion);
            });
            this.listDirectory = pageData;
            this.filterMember();
          } else {
            callback(data);
          }
        }
      });
    } catch (error) {
      CommonFn.logger(error);
    }
  }
  /**
   * tìm kiếm nhân viên
   * @param value
   * DVQuang2 27/05/2021
   */
  onSearch(): void {
    try {
      const dataSearch = encodeURI(this.inputValue.trim());

      this.pagingRequest.Filter = window.btoa(
        `[[["FullName","contains","${dataSearch}"],"or",["EmployeeCode","contains","${dataSearch}"],"or",["Mobile","contains","${dataSearch}"],"or",["ContactEmail","contains","${dataSearch}"]], "AND", ["Status","=","3"]]`
      );
      this.pagingRequest.PageIndex = 1;
      this.pagingRequest.PageSize = 20;
      this.pagingRequest.Sort = window.btoa(`[{"selector":"FullName","desc":"false"}]`);

      clearTimeout(this.timeOutSearch);

      this.timeOutSearch = setTimeout(() => {
        if (dataSearch != null) {
          //this.isLoading = true;
          this.getUserFromSystem(undefined);
        }
      }, this.delayTime);
    } catch (error) {
      CommonFn.logger(error);
    }
  }

  /**
   * cuộn xuống dưới để load more
   * @param event
   * dvquang2
   */
  onScroll(event): void {
    try {
      const scrollheight = event.target.scrollHeight;
      const scrollTop = event.target.scrollTop;
      const height = event.target.offsetHeight;
      if (scrollTop > 0 && scrollTop + height >= scrollheight) {
        //this.isLoadMore = true;

        this.pagingRequest.PageIndex++;
        this.getUserFromSystem((res) => {
          const pageData = res.Data.PageData;
          pageData.forEach((e) => {
            //this.isLoadMore = false;
            e.Avatar = this.getAvatar(e.AvatarToken, e.UserID, e.EditVersion);
          });
          this.listDirectory = this.listDirectory.concat(pageData);
          this.filterMember();
        });
      }
    } catch (error) {
      CommonFn.logger(error);
    }
  }

  /**
   * thêm thành viên vào nhóm
   * dvquang2 27/05/2021
   */
  async addMember(): Promise<any> {
    try {
      const listUserID = this.listUserSelected.map((e) => e.StringeeUserID);
      const listParticipant = new Array<Participant>();
      listUserID.forEach((e) => {
        const participant = new Participant();
        participant.ConversationID = this.conversation.id;
        participant.StringeeUserID = e;
        participant.State = FormMode.Insert;
        listParticipant.push(participant);
      });

      this.conversationSV
        .addParticipant(listParticipant)
        .subscribe((data) => { });

      this.stringeeService.addPaticipants(
        this.conversation.id,
        listUserID,
        async (res) => {
          if (res) {
            this.isVisible = false;
            this.isPopupAddMember.emit(false);
            const addMember = await this.translateSV
              .getValueByKey('ADD_MEMBER_SUCSSES', undefined)
              .toPromise();
            this.nzMessage.success(addMember);
          } else {
            const addMemberF = await this.translateSV
              .getValueByKey('ADD_MEMBER_FALSE', undefined)
              .toPromise();
            this.nzMessage.error(addMemberF);
          }
        }
      );
    } catch (error) {
      CommonFn.logger(error);
    }
  }

  /**
   * lọc khỏi danh bạ những thành viên đã ở trong nhóm
   * dvquang2 29/05/2021
   */
  filterMember(): void {
    try {
      const listParts = this.conversation.participants.map((e) => e.userId);

      listParts.forEach((part) => {
        this.listDirectory.forEach((contact) => {
          if (contact.StringeeUserID == part) {
            this.listDirectory = this.listDirectory.filter(
              (e) => e.StringeeUserID != part
            );
          }
        });
      });
    } catch (error) {
      CommonFn.logger(error);
    }
  }
}
