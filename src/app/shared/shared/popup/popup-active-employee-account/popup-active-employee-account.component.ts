import { Component, OnInit, Output, Input, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/common/components/base-component';
import { ButtonType } from '../../enum/common/button-type.enum';
import { ButtonColor } from '../../enum/common/button-color.enum';
import { ValidatorUtils } from 'src/common/fn/validator-utils';
import { Employee } from '../../models/employee/employee';
import { takeUntil } from 'rxjs/operators';
import { UserService } from 'src/app/services/user/user.service';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { AmisStringUtils } from 'src/common/fn/string-utils';
import { UserStatusEnum } from 'src/common/enum/user-status.enum';
import { DxTextBoxComponent } from 'devextreme-angular';

@Component({
  selector: 'amis-popup-active-employee-account',
  templateUrl: './popup-active-employee-account.component.html',
  styleUrls: ['./popup-active-employee-account.component.scss']
})
export class PopupActiveEmployeeAccountComponent extends BaseComponent implements OnInit {

  // ouput đóng form popup
  @Output()
  cancelPopupChoose: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  clearSelectionGrid: EventEmitter<any> = new EventEmitter<any>();

  // Ẩn/ hiện popup
  @Input()
  visiblePopup = true;

  @Input()
  employeeSelected: Employee;

  // In trên phân hệ nào
  @Input()
  layoutGridType = '';


  // tiêu đề popup
  title = 'Kích hoạt tài khoản';

  isLoading = false;

  // Enum button
  buttonType = ButtonType;

  // Enum Color
  buttonColor = ButtonColor;

  _value = "";

  isSubmit = false;
  isDuplicate = false;

  @ViewChild("textBox") textBox: DxTextBoxComponent;

  constructor(
    private userService: UserService,
    private transferSV: AmisTransferDataService,
    private translateSV: AmisTranslationService,
  ) {
    super();
  }

  ngOnInit(): void {
    
  }

  onShown(e){
    this.textBox?.instance.focus();
  }


  cancel() {
    this.cancelPopupChoose.emit(false);
  }

  onInitialized(e) {
    setTimeout(function () {
      e.component.focus();
    }, 0);
  }

  /**
   * Kích hoạt người dùng
   * Created by: dthieu 28-07-2020
   */
  activeProfile() {
    const isValidateEmail = AmisStringUtils.validateEmail(this._value);
    if (isValidateEmail) {
      this.isSubmit = false;
      this.isDuplicate = false;
      this.employeeSelected.UserName = this._value;


      // check email có trên hệ thống và trạng thái tài khoản là đang hoạt động
      this.userService.checkDuplicateEmail(this.employeeSelected).pipe(takeUntil(this._onDestroySub)).subscribe(res => {
        if (res.Success && res.Data) {
          //this.transferSV.showErrorToast(this.translateSV.getValueByKey('EMAIL_HAS_BEEN_EXISTED_IN_PROFILE'));
          this.isDuplicate = true;
        } else {
          this.isDuplicate = false;
          this.activeUser();
        }
      });
      // const object = { listUserEmails: this.employeeSelected.UserName };
      // this.userService.getStatusAccount(object).pipe(takeUntil(this._onDestroySub)).subscribe(res => {
      //   if (res?.Success) {
      //     if (res.Data?.length) {
      //       const emailReceive = res.Data?.listSuccess[0];
      //       if (this.employeeSelected.UserName == emailReceive.Email && emailReceive.Status == UserStatusEnum.Active) {
      //         this.transferSV.showErrorToast(this.translateSV.getValueByKey('USER_ACCOUNT_HAS_BEEN_EXIST_IN_SYSTEM'));
      //       } else {
      //         this.activeUser();
      //       }
      //     } else {
      //       this.activeUser();
      //     }
      //   }
      // });
    } else {
      this.isSubmit = true;
      // this.transferSV.showErrorToast(this.translateSV.getValueByKey("HUMAN_TAGBOX_INVALID_EMAIL"));
    }
  }

  onValueChanged(e) {
    this._value = e.value;
    this.isSubmit = false;
    this.isDuplicate = false;
  }

  activeUser() {
    this.userService.activeUser([this.employeeSelected]).pipe(takeUntil(this._onDestroySub)).subscribe(res => {
      if (res?.Success) {
        this.transferSV.showSuccessToast(this.translateSV.getValueByKey('CREATE_ACCOUNT_USER_SUCCESS'));
        this.employeeSelected.StatusID = res?.Data?.listSuccess[0]?.Status;

        switch (this.employeeSelected.StatusID) {
          case UserStatusEnum.Active:
            this.employeeSelected.StatusName = this.translateSV.getValueByKey('USER_STATUS_Active');
            break;

          case UserStatusEnum.Inactive:
            this.employeeSelected.StatusName = this.translateSV.getValueByKey('USER_STATUS_Inactive');
            break;

          case UserStatusEnum.NotActive:
            this.employeeSelected.StatusName = this.translateSV.getValueByKey('USER_STATUS_NotActive');
            break;

          case UserStatusEnum.Waiting:
            this.employeeSelected.StatusName = this.translateSV.getValueByKey('USER_STATUS_Waiting');
            break;

          default:
            break;
        }
        this.clearSelectionGrid.emit({
          IsSuccess: true,
          Data: this.employeeSelected
        });
      } else {
        this.transferSV.showErrorToast(this.translateSV.getValueByKey('ERROR_HAPPENED'));
      }
      this.cancel();

    });
  }

}
