import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/core/base.component';
import { CommonFn } from 'src/app/core/functions/commonFn';
import { AppConfigService } from 'src/app/core/services/app-config.service';
import { UserService } from 'src/app/core/services/users/user.service';
import { StorageConstant } from '../../constant/storage-constant';

@Component({
  selector: 'amis-content-info',
  templateUrl: './content-info.component.html',
  styleUrls: ['./content-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentInfoComponent extends BaseComponent implements OnInit {
  @Input() stringeeUserID;

  @Input() userID;

  @Input() conv;

  listUser!: Array<any>;

  item: any;

  newsfeedURL = AppConfigService.settings.newsfeedURL;
  constructor(private userSV: UserService) {
    super();
  }

  ngOnInit(): void {
    if (this.stringeeUserID) {
      this.getUser();
    }
    if (this.conv) {
      this.getUserInConv();
    }
  }

  getUserInConv(): void {
    try {
      const listUserString = CommonFn.getCacheStringeeUser();
      if (listUserString && listUserString != '') {
        const stringeeUsers = JSON.parse(listUserString);

        const listParticipant = this.conv.participants;
        if (!this.conv.isGroup) {
          // nếu trùng user đang đăng nhập thì gán tên hội thoại name
          if (this.conv.creator == UserService.UserInfo.StringeeUserID) {
            const displayUser = listParticipant.find(d => d.userId != this.conv.creator);
            this.item = stringeeUsers?.find(e => e.StringeeUserID == displayUser.userId);
          }
          // nếu ko trùng user đang đăng nhâp thì gán bằng người tạo
          else if (this.conv.creator != UserService.UserInfo.StringeeUserID) {
            const displayUser = listParticipant.find(d => d.userId == this.conv.creator);
            this.item = stringeeUsers?.find(e => e.StringeeUserID == displayUser.userId);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  getUser(): void {
    try {
      const stringUser = CommonFn.getCacheStringeeUser();
      if (stringUser) {
        this.listUser = JSON.parse(stringUser);
        this.item = this.listUser?.find(
          (e) => e.StringeeUserID == this.stringeeUserID
        );
      }
      if (!this.listUser) {
        this.userSV
          .getStringeeUser()
          .pipe(takeUntil(this._onDestroySub))
          .subscribe((stringeeUsers) => {
            CommonFn.setCacheStringeeUser(stringeeUsers);
            this.listUser = stringeeUsers.Data;
          });
      }
    } catch (error) {
      console.log(error);
    }
  }

  handleDirectToNewsfeed(): void {
    window.open(this.newsfeedURL +"/profile?userID=" + this.item.UserID, '_blank');
  }
}
