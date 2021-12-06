import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { TypeControl } from 'src/app/shared/enum/common/type-control.enum';
import { GroupFieldConfig } from 'src/app/shared/models/group-field-config/group-field-config';
import { BaseControl } from '../base-control';
import { Subject } from 'rxjs';
import { BaseComponent } from '../base-component';
import { AmisDataService } from 'src/common/services/amis-data.service';
import { FormMode } from 'src/common/enum/form-mode.enum';
import { TypeShowControl } from 'src/common/models/base/typeShow';
import { UploadTypeEnum } from 'src/app/shared/enum/uploadType/upload-type.enum';

@Component({
  selector: 'amis-amis-control-field',
  templateUrl: './amis-control-field.component.html',
  styleUrls: ['./amis-control-field.component.scss']
})
export class AmisControlFieldComponent extends BaseComponent implements OnInit {

  public subjectModelChanged: Subject<any> = new Subject<any>();

  @Input() item: GroupFieldConfig = new GroupFieldConfig();

  _isCallFromEmployeeApp: boolean = false;
  @Input() set isCallFromEmployeeApp(val) {
    if (val) {
      this._isCallFromEmployeeApp = true;
      this.controllerDictionary = "EmployeeMySelf";
      this.urlDictionary = "dictionary-data";
    }
  };

  @Output() focusOutField: EventEmitter<any> = new EventEmitter();

  @Output() onTab: EventEmitter<any> = new EventEmitter();

  @Output() valueChangedWithFieldAndValue: EventEmitter<any> = new EventEmitter();

  _typeShow: TypeShowControl;
  @Input() get typeShow() {
    return this._typeShow;
  }
  set typeShow(val) {
    if (val) {
      this._typeShow = val
    }
  }

  @Input() tabIndex;

  // có cho phép tùy chỉnh dữ liệu trên form (tag box, combobox)
  @Input()
  isShowCustomData: boolean = true;

  // emitter when value is changed
  @Output()
  modelChanged = new EventEmitter<any>();

  // emitter when value is changed
  @Output()
  valueChanged = new EventEmitter<any>();

  // emitter when value is changed
  @Output()
  afterUpdateField = new EventEmitter<any>();

  @Output()
  afterUpdateFieldView = new EventEmitter<any>();

  /**
   * Phân hệ 
   * @type {string}
   * @memberof AmisControlFormGroupComponent
   */
  _subSystemCode: string = ""
  @Input() get subSystemCode() {
    return this._subSystemCode;
  }
  set subSystemCode(val) {
    if (val) {
      this._subSystemCode = val
    }
  }

  /**
   * Quyền muốn check trong phân hệ
   * @type {string}
   * @memberof AmisControlFormGroupComponent
   */
  _permissionCode: string = ""
  @Input() get permissionCode() {
    return this._permissionCode;
  }
  set permissionCode(val) {
    if (val) {
      this._permissionCode = val
    }
  }

  /**
   * Submit form
   * created by vhtruong - 07/03/2020
   */
  _isSubmit: boolean = false;
  @Input() get isSubmit() {
    return this._isSubmit;
  }
  set isSubmit(val) {
    this._isSubmit = val;
  }

  /**
   * Chỉ cho xem
   * created by vhtruong - 07/03/2020
   */
  _isViewOnly: boolean = false;
  @Input() get isViewOnly() {
    return this._isViewOnly;
  }
  set isViewOnly(val) {
    this._isViewOnly = val;
  }

  /**
   * Có cho phép sửa không
   * created by nmduy 06/05/2020
   */
  _isEditable: boolean = false;
  @Input() get isEditable() {
    return this._isEditable;
  }
  set isEditable(val) {
    this._isEditable = val;
  }

  /**
   * có hiển thị lable không
   * created by vbcong 01/06/2020
   */
  _isShowLable: boolean = true;
  @Input() get isShowLable() {
    return this._isShowLable;
  }
  set isShowLable(val) {
    this._isShowLable = val;
  }
  /**
   * class label
   */
  _labelClass: string = "col-4 p-0 mr-2";
  @Input() get labelClass() {
    return this._labelClass;
  }
  set labelClass(val) {
    this._labelClass = val;
  }

  /**
   * width label
   */
  _labelWidth: string = "200px";
  @Input() get labelWidth() {
    return this._labelWidth;
  }
  set labelWidth(val) {
    this._labelWidth = val;
  }

  @ViewChild("field")
  field: BaseControl;

  typeControl: any;
  uploadTypeEnum: any;

  formMode: FormMode;

  acceptImage = '.jpg, .png';

  // Danh sách lỗi
  errorList: any[] = [];

  controllerDictionary: string = "Dictionary";
  urlDictionary: string = "data";

  constructor(
    public amisDataService: AmisDataService,
    // private amisTransferSV: AmisTransferDataService,
    // private amisTranslateSV: AmisTranslationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.typeControl = TypeControl;
    this.uploadTypeEnum = UploadTypeEnum;
  }


  /**
   * Trả về value sau khi validate hợp lệ hay không
   * @returns
   * @memberof AmisControlFieldComponent
   * created by vhtruong - 08/05/2020
   */
  isValidField() {
    this.validateField();
    if (this.errorList.length > 0) {
      return false;
    }
    return true;
  }


  /**
   * Sự kiện sau khi các form đã validate
   * @param {any} event
   * @memberof AmisControlFieldComponent
   * created by vhtruong - 07/05/2020
   */
  validateField() {
    if (this.field?._isShowError) {
      this.field.validate();
      if (!this.field.isValid) {
        this.errorList = this.field.errorList ?? [{ Error: "Lỗi" }];
      } else {
        this.errorList = [];
      }
      return;
    }
    this.errorList = [];
  }


  /**
   * Thay đổi giá trị của field
   * @param {any} e 
   */
  valueChange(e) {
    if (e.Data?.Value == null) {
      this.item.ValueText = null;
      e.Data.ValueText = null; // cập nhật lại giá trị value text nếu value null
    };
    this.item.IsChanged = true;
    this.valueChanged.emit(e);
  }


  /**
   * Cập nhật data từng trường
   * @returns
   * @memberof AmisControlFieldComponent
   * created by vhtruong - 14/05/2020
   */
  updateFieldData() {
    const me = this;
    if (!me.isValidField()) {
      return;
    }
    if (me.item?.Value == null) {
      me.item.ValueText = null; // cập nhật lại giá trị value text nếu value null
    };
    this.afterUpdateField.emit({
      Item: me.item,
      Field: me.field
    });
    // this.amisDataService.updateField(me.item?.SubsystemCode, me.item).subscribe(res => {
    //   if (res?.Success) {
    //     me.afterUpdateField.emit(me.item, );
    //     me.field._isViewOnly = true;
    //     me.field._isViewEditable = true;
    //     me.amisTransferSV.showSuccessToast(me.amisTranslateSV.getValueByKey("CONTROL_UPDATE_FIELD_SUCCESS"));
    //     return;
    //   } else {
    //     if (res?.ValidateInfo?.length) {
    //       if (res.ValidateInfo[0].Code == ErrorCode.DULICATEDATA) {
    //         me.item.IsErrorCustom = true;
    //         me.item.ErrorMessage = `${me.item.Caption} ${me.amisTranslateSV.getValueByKey("DUPLICATE_DATA_CONTENT")}`;
    //       } else {
    //         me.amisTransferSV.showErrorToast();
    //       }
    //       me.field.focusInput();
    //       return;
    //     }
    //   }
    //   me.amisTransferSV.showErrorToast();
    // }, error => {
    //   me.amisTransferSV.showErrorToast();
    // })
  }

  /**
   * Cập nhật lại vùng hiển thị dữ liệu mới cập nhật
   * nmduy 12/06/2020
   */
  updateFieldView() {
    const me = this;
    me.afterUpdateFieldView.emit({
      Item: me.item,
      Field: me.field
    });
  }


  /**
   * Dữ liệu thay đổi bắn ra kèm giá trị cần thay đổi
   * @param {any} e
   * @memberof AmisControlFieldComponent
   * created by vhtruong - 05/06/2020
   */
  afterChangedWihFieldAndValue(e) {
    this.valueChangedWithFieldAndValue.emit({
      FieldName: this.item.FieldName,
      ListFieldChange: e
    });
  }


  /**
   * Focus out khỏi field
   * @param {any} e 
   * @memberof AmisControlFieldComponent
   * created by vhtruong - 30/07/2020
   */
  focusOut(e) {
    this.focusOutField.emit(e);
  }

  /**
   * Bắt sk tab và shift + tab
   * @param e 
   * created by dtnam1 - 20/08/2020
   */
  onKeyDown(e) {
    if (e.keyCode == 9) {
      this.onTab.emit({
        IsTab: !e.shiftKey,
        RowIndex: this.item.RowIndex,
        ColumnIndex: this.item.ColumnIndex,
        FieldName: this.item.FieldName,
        Event: e
      });
    }
  }


}
