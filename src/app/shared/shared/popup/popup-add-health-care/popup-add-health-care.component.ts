import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormMode } from 'src/common/enum/form-mode.enum';
import { GroupConfig } from '../../models/group-config/group-config';
import { TypeShowControl } from 'src/common/models/base/typeShow';
import { ButtonColor } from '../../enum/common/button-color.enum';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { AmisDataService } from 'src/common/services/amis-data.service';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { GroupConfigUtils } from '../../function/group-control-utils';
import { takeUntil } from 'rxjs/operators';
import { ErrorCode } from 'src/common/constant/error-code/error-code';
import { BaseComponent } from 'src/common/components/base-component';
import { HealthCare } from '../../models/health-care/health-care';

@Component({
  selector: 'amis-popup-add-health-care',
  templateUrl: './popup-add-health-care.component.html',
  styleUrls: ['./popup-add-health-care.component.scss']
})
export class PopupAddHealthCareComponent extends BaseComponent implements OnInit {

  @Input() visiblePopup: boolean = false;
  @Input() title: string = "";
  @Input() height: string = "auto";
  @Input() width: string = "500px";
  @Input() fieldListConfig: any = []; // các trường dữ liệu cho form thêm
  @Input() inputParam; // tham số truyền vào 
  @Input() formMode: FormMode = FormMode.Insert; // pick list đang sửa
  @Input() currentItem = new HealthCare(); // pick list đang sửa
  @Input() fieldName: string = ""; // pick list đang sửa
  @Input() modelController: string = ""; // pick list đang sửa
  @Output() closePopup: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDataChange: EventEmitter<any> = new EventEmitter<any>();

  FormMode = FormMode;

  isError: boolean = false; //có lỗi khi lưu dữ liệu
  errorMessage: string = ""; // thông báo lỗi khi lưu dữ liệu
  //danh sách các trường để thêm dữ liệu
  listGroupConfigs: GroupConfig[] = [];
  groupFieldConfigs = [];
  isSaveAndAddNew: boolean = false; // Lưu và thêm mới
  isHaveNewValue: boolean = false; // Đã thêm mới giá trị nào chưa

  labelClass = "col-3 p-0 mr-2";
  //type control
  typeShow = new TypeShowControl();
  //submit thông tin
  isSubmit: any;
  buttonColor = ButtonColor;

  constructor(
    private amisTransferSV: AmisTransferDataService,
    private translateSV: AmisTranslationService,
    private amisDataService: AmisDataService
  ) { super(); }

  ngOnInit(): void {
    this.setView();
    this.fieldListConfig[0].GroupFieldConfigs = this.fieldListConfig[0].GroupFieldConfigs.filter(item => item.IsVisible);
    this.listGroupConfigs = AmisCommonUtils.cloneDataArray(GroupConfigUtils.GetData(this.fieldListConfig));
  }


  /**
 * set giá trị cho view
 *  created by nmduy - 11/05/2020
 */
  setView() {
    this.typeShow.IsViewOnly = false;
    this.typeShow.IsEditable = false;
    if (this.fieldListConfig[0].GroupFieldConfigs?.length) {
      for (let index = 0; index < this.fieldListConfig[0].GroupFieldConfigs.length; index++) {
        const element = this.fieldListConfig[0].GroupFieldConfigs[index];
        const fieldName = element.FieldName;
        if (this.fieldListConfig[0].GroupFieldConfigs[index].FieldName == "ProvinceID") {
          this.fieldListConfig[0].GroupFieldConfigs[index].Value = this.currentItem.ProvinceID
          this.fieldListConfig[0].GroupFieldConfigs[index].ValueText = this.currentItem.ProvinceName
        } else {
          this.fieldListConfig[0].GroupFieldConfigs[index].Value = this.currentItem[`${fieldName}`] ? this.currentItem[`${fieldName}`] : "";
        }
      }
    }
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

    if (this.fieldListConfig[0].GroupFieldConfigs?.length) {
      for (let index = 0; index < this.fieldListConfig[0].GroupFieldConfigs.length; index++) {
        const element = this.fieldListConfig[0].GroupFieldConfigs[index];
        const fieldName = element.FieldName;
        this.currentItem[`${fieldName}`] = this.fieldListConfig[0].GroupFieldConfigs[index].Value;
        if (this.fieldListConfig[0].GroupFieldConfigs[index].ValueText) {
          this.currentItem.ProvinceName = this.fieldListConfig[0].GroupFieldConfigs[index].ValueText;
        }
      }
    }
    this.saveData();
  }

  /**
   * Sự kiện đóng popup
   * nmduy 20/05/2020
   */
  onClosePopup() {
    if (this.isHaveNewValue) {
      this.onDataChange.emit()
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
   * Bắn pick list mới ra 
   * nmduy 20/05/2020
   */
  saveData() {
    this.currentItem.State = this.formMode;
    this.amisDataService.save("HealthCare", this.currentItem).pipe(takeUntil(this._onDestroySub)).subscribe(res => {
      if (res?.Success) {
        this.isHaveNewValue = true;
        let message = this.formMode == FormMode.Insert ? this.translateSV.getValueByKey("ADD_SUCCESS") : this.translateSV.getValueByKey("EDIT_SUCCESS");
        this.amisTransferSV.showSuccessToast(message);
        if (this.isSaveAndAddNew) {
          this.resetFieldConfigValue();
        } else {
          this.onDataChange.emit()
        }
      } else if (res?.ValidateInfo?.length) {
        if (res.ValidateInfo[0].Code = ErrorCode.DULICATEDATA) {
          this.listGroupConfigs[0].GroupFieldConfigs[0].IsErrorCustom = true;
        }
      } else {
        this.amisTransferSV.showErrorToast();
      }
    });
  }

  /**
   * Set lại giá trị cho field config
   * nmduy 20/05/2020 
   */
  resetFieldConfigValue() {
    this.isSubmit = AmisCommonUtils.cloneData({ IsSubmit: false });
    if (this.listGroupConfigs.length) {
      for (let i = 0; i < this.listGroupConfigs[0].GroupFieldConfigs.length; i++) {
        if (this.listGroupConfigs[0].GroupFieldConfigs[i].FieldName == "IsUse") this.listGroupConfigs[0].GroupFieldConfigs[i].Value = true;
        this.listGroupConfigs[0].GroupFieldConfigs[i].Value = "";
        this.listGroupConfigs[0].GroupFieldConfigs[i].ValueText = "";
      }
    }
  }

}
