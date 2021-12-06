import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from 'src/common/components/base-component';
import { OverviewRemindItem } from '../../enum/overview-item/overview-item.enum';
import { UserOptionService } from 'src/app/services/user-option/user-option.service';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { AmisCommonUtils } from 'src/common/fn/common-utils';

@Component({
  selector: 'amis-popup-overview-remind-setting',
  templateUrl: './popup-overview-remind-setting.component.html',
  styleUrls: ['./popup-overview-remind-setting.component.scss']
})
export class PopupOverviewRemindSettingComponent extends BaseComponent implements OnInit {

  @Input() visiblePopup: boolean = true;

  @Output() closePopup: EventEmitter<any> = new EventEmitter<any>();

  @Output() onSave: EventEmitter<any> = new EventEmitter<any>();

  isLoading: boolean = false;

  items = [];

  itemsClone = [
    { Key: OverviewRemindItem.EmployeeExpiredContract, IsShow: true, PriText: "HRM_OVERVIEW_EMPLOYEE_EXPIRED_CONTRACT", Value: 10, SubText: "HRM_OVERVIEW_EMPLOYEE_EXPIRED_CONTRACT_SUB_TEXT", SortOrder: 1 },
    { Key: OverviewRemindItem.EmployeeNotSignContract, IsShow: true, PriText: "HRM_OVERVIEW_EMPLOYEE_NOT_SIGN_CONTRACT", Value: 5, SubText: "HRM_OVERVIEW_EMPLOYEE_NOT_SIGN_CONTRACT_SUB_TEXT", SortOrder: 1 },
    { Key: OverviewRemindItem.ExpiredDeductionFamilyCircumtance, IsShow: true, HintText: "HRM_OVERVIEW_EXPIRED_DEDUCTION_HINT_TEXT", PriText: "HRM_OVERVIEW_EXPIRED_DEDUCTION", Value: 10, SubText: "HRM_OVERVIEW_EXPIRED_DEDUCTION_SUB_TEXT", SortOrder: 2 },
    { Key: OverviewRemindItem.EmployeeBirthday, IsShow: true, PriText: "HRM_OVERVIEW_EMPLOYEE_BIRTHDAY", Value: 5, SubText: "HRM_OVERVIEW_EMPLOYEE_BIRTHDAY_SUB_TEXT", SortOrder: 2 },
    { Key: OverviewRemindItem.TaskNeedDone, IsShow: true, PriText: "HRM_OVERVIEW_TASK_NEED_DONE", Value: 5, SubText: "HRM_OVERVIEW_TASK_NEED_DONE_SUB_TEXT", SortOrder: 3 },
    // { Key: OverviewRemindItem.ProfileMissingInfo, IsShow: true, PriText: "HRM_OVERVIEW_PROFILE_MISSING_INFO", Value: 10, SubText: "HRM_OVERVIEW_PROFILE_MISSING_INFO_SUB_TEXT", SortOrder: 3 },
    { Key: OverviewRemindItem.ExpiredDocument, IsShow: true, PriText: "HRM_OVERVIEW_EXPIRED_DOCUMENT", Value: 10, SubText: "HRM_OVERVIEW_EXPIRED_DOCUMENT_SUB_TEXT", SortOrder: 4 },
    { Key: OverviewRemindItem.ReceiveDateCelebration, IsShow: true, PriText: "HRM_OVERVIEW_RECEIVE_DATE_CELEBRATION", Value: 5, SubText: "HRM_OVERVIEW_RECEIVE_DATE_CELEBRATION_SUB_TEXT", SortOrder: 4 },
  ];

  constructor(
    private userOptionSV: UserOptionService,
    private amisTransferSV: AmisTransferDataService,
    private amisTranslateSV: AmisTranslationService
  ) { super(); }

  ngOnInit(): void {
    this.setUserOption();
  }


  /**
   * kiểm tra user có lưu tùy chỉnh thiết lập chưa
   * nmduy 03/08/2020
   */
  setUserOption() {
    this.items = AmisCommonUtils.cloneDataArray(this.itemsClone);
    if (this.currentUserInfo.UserOptions?.OverviewRemindSetting?.length) {
      let overviewSettings = this.currentUserInfo.UserOptions?.OverviewRemindSetting;
      for (let i = 0; i < overviewSettings.length; i++) {
        const element = overviewSettings[i];
        const item = this.items.find(i => i.Key == element.Key);
        if (item) {
          item.IsShow = element.IsShow;
          item.Value = element.Value;
          item.SortOrder = element.SortOrder;
        }
      }
    }
  }


  /**
  * Hàm hủy chọn option lưuu
  * created by: hgvinh 30/07/2020
  */
  onClosePopup() {
    this.closePopup.emit();
  }

  /**
   * tích chọn. bỏ tích chọn check box 
   * created by: nmduy 03/08/2020
   */
  valueChanged(event, item?) {
    if (event.event && item) {
      item.IsShow = !item.IsShow;
    }
  }


  /**
   * Click ấn lưu
   * nmduy 03/08/2020
   */
  onClickSave() {
    let param = {
      OverviewRemindSetting: []
    }
    this.items.forEach(element => {
      let obj = {
        Key: element.Key,
        IsShow: element.IsShow,
        Value: element.Value,
        SortOrder: element.SortOrder,
      }
      param.OverviewRemindSetting.push(obj);
    });
    const userOp = this.userOptionSV.saveUserOption(param).subscribe(res => {
      if (res?.Success) {
        this.amisTransferSV.showSuccessToast(this.amisTranslateSV.getValueByKey("SAVE_SUCCESS"));
        this.amisTransferSV.onChangeUserOption(param);
        this.onClosePopup();
      } else {
        this.amisTransferSV.showErrorToast(this.amisTranslateSV.getValueByKey("ERROR_HAPPENED"));
      }
    });

    this.unSubscribles.push(userOp);
  }

  /**
   * validate dữ liệu trước khi lưu
   * nmduy 05/08/2020
   */
  onFocusOut(item) {
    if (!item.Value || item.Value < 0) {
      item.Value = 0;
    }
  }
}
