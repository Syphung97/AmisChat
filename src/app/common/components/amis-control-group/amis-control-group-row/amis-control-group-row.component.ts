import { Component, OnInit, Input, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { GroupConfig } from 'src/app/shared/models/group-config/group-config';
import { AmisControlFieldComponent } from '../../amis-control-field/amis-control-field.component';
import { GroupFieldConfig } from 'src/app/shared/models/group-field-config/group-field-config';
import { TypeControl } from 'src/app/shared/enum/common/type-control.enum';
import { AmisCommonUtils } from 'src/common/fn/common-utils';

@Component({
  selector: 'amis-amis-control-group-row',
  templateUrl: './amis-control-group-row.component.html',
  styleUrls: ['./amis-control-group-row.component.scss']
})
export class AmisControlGroupRowComponent implements OnInit {

  @Input() listGroupbox: GroupConfig[] = [];

  @Input() groupbox: GroupConfig = new GroupConfig();

  @Input() isCallFromEmployeeApp: boolean = false;

  @Output() afterValidatedForm: EventEmitter<any> = new EventEmitter();

  @Output() valueChangedWithFieldAndValue: EventEmitter<any> = new EventEmitter();

  @Output() focusOutField: EventEmitter<any> = new EventEmitter();

  @Output() onTab: EventEmitter<any> = new EventEmitter();

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

  _typeShow: object;
  @Input() get typeShow() {
    return this._typeShow;
  }
  set typeShow(val) {
    if (val) {
      this._typeShow = val
    }
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
  _labelWidth: string = "";
  @Input() get labelWidth() {
    return this._labelWidth;
  }
  set labelWidth(val) {
    this._labelWidth = val;
  }

  // emitter when value is changed
  @Output()
  afterUpdateField = new EventEmitter<any>();


  @Output()
  afterUpdateFieldView = new EventEmitter<any>();

  // emitter when value is changed
  @Output()
  modelValueChanged = new EventEmitter<any>();


  // emitter when value is changed
  @Output()
  modelChangedValue = new EventEmitter<any>();

  @Output()
  valueChanged = new EventEmitter<any>();

  @Input()
  rowMargin: string = "8px 0";

  // có cho phép tùy chỉnh dữ liệu trên form (tag box, combobox)
  @Input()
  isShowCustomData: boolean = true;

  listErrorValidates = [];

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

  @ViewChildren("field")
  field: QueryList<AmisControlFieldComponent>;

  isValid: boolean = true;

  errorList: any[] = [];

  constructor() { }

  ngOnInit(): void {
  }


  /**
   * Validate ở row
   * @returns 
   * @memberof AmisControlGroupRowComponent
   * created by vhtruong - 08/05/2020
   */
  isValidField() {
    let isValid = true;
    this.errorList = [];
    this.field.forEach(x => {
      if (x.item) {
        if (!x.isValidField()) {
          this.errorList.push(x);
        }
      }
    });
    if (this.errorList.length > 0) {
      isValid = false;
    }
    return isValid;
  }

  /**
   *Emit sự kiện thay đổi giá trị
   */
  valueChange(e: any) {
    this.valueChanged.emit(e);
  }


  /**
   * Sau khi cập nhật trường
   * @param {any} e 
   * @memberof AmisControlGroupRowComponent
   * created by vhtruong - 14/05/2020
   */
  updatedField(e) {
    if (e) {
      this.afterUpdateField.emit(e);
    }
  }

  /**
   * Sau khi cập nhật giá trị hiển thị của trường dữ liệu
   * @param {any} e 
   * @memberof AmisControlGroupRowComponent
   * created by nmduy 12/06/2020
   */
  updatedFieldView(e) {
    if (e) {
      this.afterUpdateFieldView.emit(e);
    }
  }


  /**
   * Tiền xử lý sửa 1 trường
   * @param {GroupFieldConfig} obj 
   * @memberof AmisControlGroupRowComponent
   */
  beforeEditValue(obj: GroupFieldConfig) {
    this.field?.forEach(e => {
      if (e.item?.FieldName != obj.FieldName && !e.field?._isViewOnly) {
        e.field?.onClickCancel();
      }
    })
  }


  /**
   * Dữ liệu thay đổi bắn ra kèm giá trị cần thay đổi
   * @param {any} e 
   * @memberof AmisControlGroupRowComponent
   * created by vhtruong - 05/06/2020
   */
  afterChangedWihFieldAndValue(e) {
    this.valueChangedWithFieldAndValue.emit(e);
  }

  /**
   * Focus out khỏi field
   * @param {any} e 
   * created by vhtruong - 30/07/2020
   */
  focusOut(e) {
    this.focusOutField.emit(e);
  }

  /**
   * xử lý khi nhấn tab hoặc shift + tab
   * @param e 
   * created by dtnam1 20/8/2020
   */
  handleTabForm(e, isDirectFocus: boolean = false) {
    if (this.groupbox.IsVerticalTab) {
      return;
    }
    let currentFieldName = AmisCommonUtils.cloneData(e.FieldName);
    let colOne: any = this.groupbox.ColOne.filter(f => f.IsUse);
    let colTwo: any = this.groupbox.ColTwo.filter(f => f.IsUse);
    if (!isDirectFocus) {
      // lọc bỏ field có isuse = false

      let fieldIndex = colOne.findIndex(x => x.FieldName === e.FieldName);
      let atColOne = true;
      //tìm đc trường cần focus
      if (fieldIndex === -1) {
        fieldIndex = colTwo.findIndex(x => x.FieldName === e.FieldName);
        atColOne = false;
      }

      if (e.IsTab) {
        if (atColOne) {
          e.FieldName = colTwo[fieldIndex]?.FieldName;
        } else {
          e.FieldName = colOne[fieldIndex + 1]?.FieldName;
        }
      }
      else {
        if (atColOne) {
          e.FieldName = colTwo[fieldIndex - 1]?.FieldName;
        } else {
          e.FieldName = colOne[fieldIndex]?.FieldName;
        }
      }
    }

    let focusField: any = this.field?.find(x => x.item?.FieldName === e.FieldName);

    if (focusField) {
      //TH gặp control ReadOnly
      if (focusField?.item?.IsReadOnly) {
        this.handleTabForm({
          IsTab: e.IsTab,
          RowIndex: focusField.item.RowIndex,
          ColumnIndex: focusField.item.ColumnIndex,
          FieldName: focusField.item.FieldName,
          Event: e.Event
        })
        return;
      }
    }
    else {
      if (!e.IsTab) {
        //TH đầu form khi tab ngược chiều
        if (currentFieldName === this.groupbox.ColOne[0].FieldName) {
          this.onTab.emit({
            IsTab: e.IsTab,
            GroupConfigID: this.groupbox.GroupConfigID,
            Event: e.Event
          })
          return;
        }
      }
      else {
        //TH cuối form khi tab xuôi chiều
        if (currentFieldName === colOne[colOne.length - 1].FieldName) {
          this.onTab.emit({
            IsTab: e.IsTab,
            GroupConfigID: this.groupbox.GroupConfigID,
            Event: e.Event
          })
          return;
        }
      }
    }


    //tiến hành focus
    let fieldChild = focusField?.field;
    if (fieldChild) {
      if (fieldChild.input?.nativeElement) {
        fieldChild.input.nativeElement.focus();
      } else if (fieldChild.input?.instance) {
        fieldChild.input.instance.focus();
      } else if (fieldChild.datebox?.instance) {
        fieldChild.datebox.instance.focus();
      } else if (fieldChild.popupSelectData?.instance) {
        fieldChild.popupSelectData.instance.focus();
      } else if (fieldChild.selectbox?.instance) {
        fieldChild.selectbox.instance.focus();
      } else if (fieldChild.dropdown?.instance) {
        fieldChild.dropdown.instance.focus();
      }
      //chặn event tab ban đầu
      e.Event?.preventDefault();

    }
  }

  /**
   * Sự kiện khi model thay đổi
   * @param {any} e 
   */
  ngModelValueChanged(e) {
    this.modelValueChanged.emit(e);
  }


}
