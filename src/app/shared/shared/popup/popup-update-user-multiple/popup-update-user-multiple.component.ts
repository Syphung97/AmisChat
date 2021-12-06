import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
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
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { OrganizationUnit } from '../../models/organization-unit/organization-unit';
import { DxSelectBoxComponent } from 'devextreme-angular';
import { AmisStringUtils } from 'src/common/fn/string-utils';
import { Employee } from '../../models/employee/employee';
import { ConfigService } from 'src/app/services/config/config.serice';
import { AmisButtonComponent } from 'src/common/components/amis-button/amis-button.component';
import { BaseControl } from 'src/common/components/base-control';
import { GroupFieldConfig } from '../../models/group-field-config/group-field-config';
import { AmisControlFieldComponent } from 'src/common/components/amis-control-field/amis-control-field.component';

@Component({
  selector: 'amis-popup-update-user-multiple',
  templateUrl: './popup-update-user-multiple.component.html',
  styleUrls: ['./popup-update-user-multiple.component.scss']
})
export class PopupUpdateUserMultipleComponent extends BaseComponent
  implements OnInit {
  @Input()
  visiblePopup: boolean = false;
  title = '';
  height = 'auto';
  width = '600px';
  _typeShow: TypeShowControl = new TypeShowControl();
  @Input()
  listEmployee = [];
  // biến show thông báo
  visibleNotify = false;
  // nội dung thông báo
  contentNotify = '';

  @Input()
  subSystemCode = 'Employee';

  listEmployeeID = [];
  @Output()
  closePopup: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  afftersave: EventEmitter<any> = new EventEmitter<any>();

  formMode = FormMode;

  groupSelectItem: any;

  groupConfigID = [];

  // submit thông tin
  isSubmit: any;
  buttonColor = ButtonColor;

  @ViewChild('select', { static: false })
  selectBox: DxSelectBoxComponent;


  @ViewChild("field")
  fieldBase: AmisControlFieldComponent;

  @ViewChild("btnsave")
  btnSave: AmisButtonComponent;

  listFieldUpdate = [];
  isLoading = false;

  isDisableSave = true;

  isNotControl = true;

  constructor(
    private amisTransferSV: AmisTransferDataService,
    private translateSV: AmisTranslationService,
    private configSV: ConfigService,
    private amisDataService: AmisDataService,
    private employeeSV: EmployeeService
  ) {
    super();
  }

  ngOnInit(): void {
    this.isDisableSave = true;
    this.title = this.translateSV.getValueByKey(
      'TOOLBAR_SEND_UPDATE_INFOR'
    );
    this.getListEmployeeID();
    this.loadListFieldUpdate();
    this._typeShow.IsEditable = false;
    this._typeShow.IsViewOnly = false;
    this._typeShow.IsViewEditable = false;
  }

  getListEmployeeID(){
    if(this.listEmployee?.length > 0){
      this.listEmployeeID = this.listEmployee.map(p => p.EmployeeID);
    }
  }
  /**
   * hàmthiết lập enter là luuw xuống
   *
   * @param {any} e
   * @memberof PopupUpdateUserMultipleComponent
   */
  readyPopup(e){
    e.component.registerKeyHandler('enter', item => {
      this.saveUserMutiple();
    } );
  }
/**
   * hàmthiết lập enter đóng noti
   *
   * @param {any} e
   * @memberof PopupUpdateUserMultipleComponent
   */
  readyPopupNoti(e){
    e.component.registerKeyHandler('enter', item => {
      this.cancelPopupNotify();
    } );
  }
  /** */
  showPopup(e){
    this.selectBox.instance.focus();
  }
  /**
   * lấy danh sách các tiêu chí lọc
   *
   * @memberof HrmProfileToolbarFilterComponent
   * vbcong 14/05/2020
   */
  loadListFieldUpdate() {
    const typeConfig = 1;
    this.configSV
      .getFieldConfigDefault(this.subSystemCode, typeConfig)
      .subscribe(res => {
        if (res && res.Success) {
          this.listFieldUpdate = this.buildLisFieldUpdate(res.Data);
          // this.onSearchControl(null);
        }
      });
  }
  /**
   * build danh sách control update hàng loạt
   *
   * @param {any} listData
   * @returns
   * @memberof PopupUpdateUserMultipleComponent
   * vbcong 02/07/2020
   */
  buildLisFieldUpdate(listData){
    if(listData?.length > 0){
      listData.forEach(item => {
        item.CaptionSearch = AmisStringUtils.convertVNtoENToLower(item.Caption);
        item.IsReadOnly = false;
        if(!!item.CustomConfig){
          const customConfig = AmisCommonUtils.Decode(item.CustomConfig);
          if(customConfig.IsDynamicCombobox){
            customConfig.IsDynamicCombobox = false;
          }
          item.CustomConfig = AmisCommonUtils.Encode(customConfig);
        }
        if(item.CustomConfigParse){
          if(item.CustomConfigParse.IsDynamicCombobox){
            item.CustomConfigParse.IsDynamicCombobox = false;
          }
        }
      });
    }
    return listData;
  }

  slelectField(e){
    if(e?.itemData){
      this.groupSelectItem = e.itemData;
    }
  }
  /**
   * thay đổi value
   *
   * @param {any} e
   * @memberof PopupUpdateUserMultipleComponent
   */
  changeSelect(e){
    if(e?.value){
      this.isNotControl = false;
      this.isDisableSave = false;
    }else{
      this.isNotControl = true;
      this.isDisableSave = true;
    }
  }

  openBoxSelectControl(e){
    this.isNotControl = true;
  }
  closeBoxSelectControl(e){
    const item = e.component.option('selectedItem');
    if(!!item){
      this.isNotControl = false;
    }else{
      this.isNotControl = true;
    }
  }


  /**
   * Sự kiện đóng popup
   * nmduy 20/05/2020
   */
  onClosePopup() {
    this.visiblePopup = false;
    this.closePopup.emit();
  }
  afterChangedWihFieldAndValue(e){

  }

  valueChange(e){
    // if(this.btnSave && this.btnSave.el && this.btnSave.el.nativeElement){
    //   this.btnSave.el.nativeElement.children[0].focus();
    // }
  }

  /**
   * cập nhật nhiều field
   * vbcong 20/05/2020
   */
  saveUserMutiple() {
    if(!!this.groupSelectItem && this.listEmployeeID?.length > 0){
      this.groupSelectItem.ID = this.listEmployeeID.join(';');
      this.amisDataService.updateMultiData(this.groupSelectItem.SubsystemCode, this.groupSelectItem).subscribe(res => {
        if (res?.Success) {
          if (res?.ValidateInfo?.length) {
            const mess = res.ValidateInfo[0].ErrorMessage;
            const iDFaild = res.ValidateInfo[0].ID;
            if(!!iDFaild){
              const listIDFaild = iDFaild.split(';');
              listIDFaild.forEach(item => {
                const id = parseInt(item, 0);
                AmisCommonUtils.RemoveItem(this.listEmployeeID, id);
              });
            }
            this.fieldBase.field.isShowError = true;
            this.fieldBase.field.isSubmit = true;
            this.fieldBase.field.isError = true;
            this.fieldBase.field.focusInput();
            this.visibleNotify = true;
            this.contentNotify = mess;
          }else{
            const customConfig = JSON.parse(this.groupSelectItem.CustomConfig);
            if(!!customConfig){
              const listFieldChange = customConfig.ListFieldChange;
              if(listFieldChange?.length > 0){
                listFieldChange.forEach(ite => {
                  if(!!ite.FieldSetValue){
                    ite.Value = res.Data[ite.FieldSetValue];
                  }
                  if(!!ite.FieldSetValueText){
                    ite.ValueText = res.Data[ite.FieldSetValueText];
                  }
                });
                this.groupSelectItem.CustomConfigParse = customConfig;
              }
            }
            this.amisTransferSV.showSuccessToast(this.translateSV.getValueByKey('SAVE_SUCCESS'));
            this.visiblePopup = false;
          }
          this.groupSelectItem.ID = this.listEmployeeID.join(';');
          this.afftersave.emit(this.groupSelectItem);
        } else {
          if (res?.ValidateInfo?.length) {
            const mess = res.ValidateInfo[0].ErrorMessage;
            this.fieldBase.field.isShowError = true;
            this.fieldBase.field.isSubmit = true;
            this.fieldBase.field.isError = true;
            this.fieldBase.field.focusInput();
            this.visibleNotify = true;
            this.contentNotify = mess;
          }else{
            this.amisTransferSV.showErrorToast(this.translateSV.getValueByKey('ERROR_HAPPENED'));
          }
        }
        // me.amisTransferDataService.showErrorToast();
      }, error => {
        // me.amisTransferDataService.showErrorToast();
      });
    }
  }
  /**
   * đóng fỏm thông báo
   *
   * @memberof PopupUpdateUserMultipleComponent
   * vbcong
   */
  cancelPopupNotify(){
    this.visibleNotify = false;
    this.fieldBase.field.focusInput();
  }
}
