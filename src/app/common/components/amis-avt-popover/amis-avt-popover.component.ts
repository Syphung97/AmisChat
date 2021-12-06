import { Component, OnInit } from "@angular/core";
import { BaseComponent } from '../base-component';
// import { AvatarService } from 'src/app/shared/services/users/avatar-service';
import { Router } from '@angular/router';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { TransferDataService } from 'src/app/services/base/transfer-data.service';
import { AvatarService } from 'src/app/services/user/avatar.service';

@Component({
  selector: "amis-avt-popover",
  templateUrl: "./amis-avt-popover.component.html",
  styleUrls: ["./amis-avt-popover.component.scss"]
})
export class AmisAvtPopoverComponent extends BaseComponent implements OnInit {

  // bien an hien avt
  visiblePopoverAvt = false;


  avatarUrl = "";

  // Vai trò trong hệ thống
  roleName = "";

  roleCode = "";

  userName = "";

  constructor(
    private transferDataSV: TransferDataService,
    private avatarSV: AvatarService,
    private route: Router,
    private translateSV: AmisTranslationService
  ) {
    super();
  }

  ngOnInit() {

    this.translateSV.initLanguage();

    this.initTransferData();

    this.getUserName();
  }


  /**
   * Lấy thông tin đăng nhập của người dùng từ Local Storage
   * CREATED BY NMDUC - 29/04/2020
   * @memberof AmisAvtPopoverComponent
   */
  getUserName() {
    this.userName = localStorage.getItem("Login_Account") ? localStorage.getItem("Login_Account") : "";
  }


  /**
   * Khởi tạo các Transfer data
   * CREATED BY NMDUC - 26/04/2020
   * @memberof AmisAvtPopoverComponent
   */
  initTransferData() {
    const subUserInfo = this.transferDataSV.dataUserOption.subscribe(res => {
      if (res) {
        this.avatarUrl = this.avatarSV.getAvatar(res.UserID, true, 64, 64);
        this.roleCode = res.RoleCode;
        switch (this.roleCode) {
          // case "Administrator" || "Administrator_Task":
          //   this.roleName = this.translateSV.getValueByKey("SYSTEM_ROLE_ADMINISTRATOR");
          //   break;
          case "Member_Task":
            this.roleName = this.translateSV.getValueByKey("SYSTEM_ROLE_MEMBER");
            break;
          case "Restrict_Task":
            this.roleName = this.translateSV.getValueByKey("SYSTEM_ROLE_RESTRICT");
            break;
          default:
            this.roleName = this.translateSV.getValueByKey("SYSTEM_ROLE_ADMINISTRATOR");
            break;
        }
      }
    });
    this.unSubscribles.push(subUserInfo);
  }


  /**
   * Sự kiện đăng xuất
   * CREATED BY NMDUC - 28/04/2020
   * @memberof AmisAvtPopoverComponent
   */
  logout() {
    location.pathname = "/logout";
    // window._logoutAMIS();
  }


  /**
   * Thiết lập người dùng
   * CREATED BY NMDUC - 26/04/2020
   * @memberof AmisAvtPopoverComponent
   */
  settingUser() {
    this.visiblePopoverAvt = false;
    this.route.navigate(['setting']);
  }
}
