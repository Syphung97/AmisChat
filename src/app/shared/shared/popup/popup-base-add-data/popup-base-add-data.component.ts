import { Component, OnInit, Input, EventEmitter, Output, ElementRef, ViewChild } from '@angular/core';
import { ButtonColor } from '../../enum/common/button-color.enum';
import { TypeShowControl } from 'src/common/models/base/typeShow';
import { GroupConfigUtils } from '../../function/group-control-utils';
import { BaseComponent } from 'src/common/components/base-component';
import { takeUntil } from 'rxjs/operators';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { FormMode } from 'src/common/enum/form-mode.enum';
import { ErrorCode } from 'src/common/constant/error-code/error-code';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { AmisDataService } from 'src/common/services/amis-data.service';

@Component({
  selector: 'amis-popup-base-add-data',
  templateUrl: './popup-base-add-data.component.html',
  styleUrls: ['./popup-base-add-data.component.scss']
})
export class PopupBaseAddDataComponent extends BaseComponent implements OnInit {

  @ViewChild("formGroup")
  formGroup: ElementRef;

  @Input() visiblePopup: boolean = false;

  @Input() title: string = "";

  @Input() height: string = "auto";

  @Input() width: string = "500px";

  // các trường dữ liệu cho form thêm
  @Input() inputParam; // tham số truyền vào 

  @Input() formMode: FormMode = FormMode.Insert;

  @Input() currentItem; // object đang sửa

  @Input() fieldName: string = "";

  @Input() modelController: string = "";

  @Input() dependentDatas: any;

  @Input() valueExpr: string = "";

  @Input() labelWidth: string = "";

  @Input() labelClass: string = "col-3 p-0 mr-2";

  @Output() closePopup: EventEmitter<any> = new EventEmitter<any>();

  @Output() onDataChange: EventEmitter<any> = new EventEmitter<any>();

  // Lấy group config để gen form thêm
  @Input() set groupConfig(value) {
    if (value) {
      this.setGroupConfig(value);
    }
  }

  groupBox: any;

  groupBoxClone: any;

  //object truyền vào form group sau khi gọi lên service
  objectAfterSubmit: any;

  currentData: any;

  isError: boolean = false; //có lỗi khi lưu dữ liệu
  errorMessage: string = ""; // thông báo lỗi khi lưu dữ liệu
  //danh sách các trường để thêm dữ liệu
  groupFieldConfigs = [];
  isSaveAndAddNew: boolean = false; // Lưu và thêm mới
  isHaveNewValue: boolean = false; // Đã thêm mới giá trị nào chưa

  //type control
  typeShow = new TypeShowControl();
  //submit thông tin
  isSubmit: any;
  buttonColor = ButtonColor;
  FormMode = FormMode;

  constructor(
    private amisTransferSV: AmisTransferDataService,
    private translateSV: AmisTranslationService,
    private amisDataService: AmisDataService
  ) { super(); }

  ngOnInit(): void {
    this.setView();
  }


  /**
   * Set dữ liệu
   * nmduy 
   */
  setGroupConfig(data) {
    if (data) {
      this.groupBox = AmisCommonUtils.cloneData(data);
      const visibleGroupField = data?.GroupFieldConfigs.filter(item => item.IsVisible);
      if (visibleGroupField?.length) {
        this.groupBox.GroupFieldConfigs = AmisCommonUtils.cloneDataArray(visibleGroupField);
      }
      this.groupBox = GroupConfigUtils.SetDataGroupCOnfig(this.groupBox);
      this.groupBoxClone = AmisCommonUtils.cloneData(this.groupBox);
      this.groupBoxClone.GroupFieldConfigs = AmisCommonUtils.cloneDataArray(this.groupBox.GroupFieldConfigs);
    }
  }


  /**
 * set giá trị cho view
 *  created by nmduy - 11/05/2020
 */
  setView() {
    this.typeShow.IsViewOnly = false;
    this.typeShow.IsEditable = false;
    this.groupBox.GroupFieldConfigs?.forEach(element => {
      element.ID = this.currentItem[`${this.valueExpr}`];
      const fieldName = element.FieldName;
      element.Value = this.currentItem[`${fieldName}`] ? this.currentItem[`${fieldName}`] : "";
      if (element.DisplayField) {
        element.ValueText = this.currentItem[`${element.DisplayField}`] ? this.currentItem[`${element.DisplayField}`] : "";
      }
    });
  }


  /**
   * Bắn kết quả sau khi submit form
   * nmduy 20/05/2020
   * @param event 
   */
  afterValidated(event) {
    if (event?.length) {
      console.log(event);
      console.log("co loi xay ra");
      return;
    }

    this.groupBox.GroupFieldConfigs.forEach(element => {
      const fieldName = element.FieldName;

      this.currentItem[`${fieldName}`] = element.Value;
      // if (element.TypeControl != TypeControl.Checkbox && element.Value?.trim()) {
      //   this.currentItem[`${fieldName}`] = element.Value.trim();
      // }
      if (element.DisplayField && element.DisplayField != element.FieldName) {
        this.currentItem[`${element.DisplayField}`] = element.ValueText;
      }
    });

    this.saveData();
  }

  /**
   * Sự kiện đóng popup
   * nmduy 20/05/2020
   */
  onClosePopup() {
    if (this.isHaveNewValue) {
      this.onDataChange.emit(this.currentData);
    } else {
      this.closePopup.emit();
    }
  }

  /**
   * Sự kiện click lưu hoặc lưu và thêm mới
   * nmduy 20/05/2020
   */
  onClickAdd(e?) {
    this.isSubmit = AmisCommonUtils.cloneData({ IsSubmit: true });
    if (e) {
      this.isSaveAndAddNew = true;
      this.title = this.translateSV.getValueByKey("POPUP_SELECT_DATA_ADD_DATA", { FieldName: this.fieldName });
      this.formMode = FormMode.Insert;
    } else {
      this.isSaveAndAddNew = false;
    }
  }

  /**
   * Lưu dữ liệu mới
   * nmduy 20/05/2020
   */
  saveData() {
    this.currentItem.State = this.formMode;
    // this.currentItem.GroupConfigs = this.fieldListConfig;
    this.amisDataService.save(this.modelController, this.currentItem).pipe(takeUntil(this._onDestroySub)).subscribe(res => {
      if (res?.Success) {
        this.isHaveNewValue = true;
        this.currentData = res?.Data;
        let message = this.formMode == FormMode.Insert ? this.translateSV.getValueByKey("ADD_SUCCESS") : this.translateSV.getValueByKey("EDIT_SUCCESS");
        this.amisTransferSV.showSuccessToast(message);
        if (this.isSaveAndAddNew) {
          this.resetFieldConfigValue();
        } else {
          this.onClosePopup();
        }

      } else {
        if (res?.ValidateInfo?.length) {
          const listDuplicate = res.ValidateInfo.filter(v => v.Code == ErrorCode.DULICATEDATA);
          if (listDuplicate?.length) {
            if (this.groupBox.GroupFieldConfigs?.length) {
              this.groupBox.GroupFieldConfigs.forEach(gf => {
                let index = listDuplicate.findIndex(l => l.AdditionInfo?.FieldName == gf.FieldName);
                if (index != -1) {
                  gf.IsErrorCustom = true;
                  gf.ErrorMessage = `${gf.Caption} ${this.translateSV.getValueByKey("DUPLICATE_DATA_CONTENT")}`;
                }
              })
            }
          }
          this.objectAfterSubmit = AmisCommonUtils.cloneData({
            IsError: true
          })
          return;
        } else {
          this.amisTransferSV.showErrorToast();
        }
      }
    });
  }

  /**
   * Set lại giá trị cho field config
   * nmduy 20/05/2020 
   */
  resetFieldConfigValue() {
    this.isSubmit = AmisCommonUtils.cloneData({ IsSubmit: false });
    this.groupBox = AmisCommonUtils.cloneData(this.groupBoxClone);
    this.groupBox.GroupFieldConfigs = AmisCommonUtils.cloneDataArray(this.groupBoxClone.GroupFieldConfigs);
  }

  /**
   * Focus vào ô nhập liệu khi mở popup
   * nmduy 06/07/2020
   */
  onShownPopup(e) {
    setTimeout(() => {
      const lstInput = this.formGroup?.nativeElement?.querySelectorAll('input');
      if (lstInput?.length > 0) {
        for (let i = 0; i < lstInput.length; i++) {
          if (lstInput[i].getAttribute('type') !== "hidden") {
            lstInput[i].focus();
            return;
          }
        }
      }
    }, 0);

  }
}