import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, ComponentFactoryResolver, Injector, ViewContainerRef } from '@angular/core';
import { BaseComponent } from '../base-component';
import { GroupConfig } from 'src/app/shared/models/group-config/group-config';
import { DependenDictionary } from 'src/app/shared/models/field-dependancy/field-dependancy';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { FormMode } from 'src/common/enum/form-mode.enum';
import { DependentData } from 'src/app/shared/models/dependent-data/dependent-data';
import { DependentClone } from 'src/app/shared/models/dependent-clone/dependent-clone';
import { ConfigValidate } from 'src/app/shared/models/config-validate/config-validate';
import { AmisControlGroupComponent } from '../amis-control-group/amis-control-group.component';


@Component({
  selector: 'amis-amis-control-form-group',
  templateUrl: './amis-control-form-group.component.html',
  styleUrls: ['./amis-control-form-group.component.scss']
})
export class AmisControlFormGroupComponent extends BaseComponent implements OnInit {

  @Input() listGroupbox: GroupConfig[];

  @Input() DependentDictionaries: DependenDictionary[];

  @Input() DependentDatas: DependentData[];

  @Input() DependentClones: DependentClone[];

  @Input() ConfigValidates: ConfigValidate[];

  @Input() MasterData: any;

  @Input() isUseMasterData: boolean = false;
  
  @Input() isCallFromEmployeeApp: boolean = false;

  @Input() isCustomHanldeValidateInfos: boolean = false; // tự xử lý cập nhật field những trường hợp nghiệp vụ đặc biệt

  @Output() afterValidatedForm: EventEmitter<any> = new EventEmitter();

  @Output() valueFieldChanged: EventEmitter<any> = new EventEmitter();

  @Output() focusOutField: EventEmitter<any> = new EventEmitter();

  @Output() addItemGrid: EventEmitter<any> = new EventEmitter();

  // click đồng ý sau khi validate infos trả về
  @Output() onClickYesEvent: EventEmitter<any> = new EventEmitter();

  // output click không trên popup confirm
  @Output() onClickNoEvent: EventEmitter<any> = new EventEmitter();

  // Sự kiện bắn ra khi có thay đổi dữ liệu của grid
  @Output()
  afterChangeDataGrid: EventEmitter<any> = new EventEmitter<any>();

  // là popup confirm hay option
  @Input() isConfirmNotify: boolean = false;


  // Key thông báo khi lưu dữ liệu thất bại
  @Input() isCustomSaveAfterValidate: boolean = false;


  /**
   * Input truyền vào để thay đổi cách view dữ liệu
   * @type {object}
   * @memberof AmisControlFormGroupComponent
   */
  _inputChangeView: object;
  @Input() get inputChangeView() {
    return this._inputChangeView;
  }
  set inputChangeView(val) {
    if (val) {
      this._inputChangeView = val
    }
  }

  _inputAfterSubmit: object;
  @Input() get inputAfterSubmit() {
    return this._inputAfterSubmit;
  }
  set inputAfterSubmit(val) {
    if (val) {
      this._inputAfterSubmit = val
    }
  }

  // reload lại dữ liệu groupconfig
  _inputReloadDataGroupConfig: object;
  @Input() get inputReloadDataGroupConfig() {
    return this._inputReloadDataGroupConfig;
  }
  set inputReloadDataGroupConfig(val) {
    if (val) {
      this._inputReloadDataGroupConfig = val
    }
  }


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
  _labelWidth: string = "200px";
  @Input() get labelWidth() {
    return this._labelWidth;
  }
  set labelWidth(val) {
    this._labelWidth = val;
  }

  // emitter when value is changed
  @Output()
  afterUpdateField = new EventEmitter<any>();

  /**
   * Submit form
   * created by vhtruong - 07/03/2020
   */
  _isSubmit: any;
  @Input() get isSubmit() {
    return this._isSubmit;
  }
  set isSubmit(val) {
    if (val) {
      this._isSubmit = AmisCommonUtils.cloneData(val);
    }
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
   * Kiểu header
   * created by vhtruong - 07/03/2020
   */
  _headerType: string = "title";
  @Input() get headerType() {
    return this._headerType;
  }
  set headerType(val) {
    this._headerType = val;
  }

  /**
   * Dạng button của header nếu có: 'none', 'right', 'rightOfText'
   * created by vhtruong - 07/03/2020
   */
  _headerBtnPosition: string = "none";
  @Input() get headerBtnPosition() {
    return this._headerBtnPosition;
  }
  set headerBtnPosition(val) {
    this._headerBtnPosition = val;
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
   * FormMode
   * created by nmduy 06/05/2020
   */
  _formMode: FormMode;
  @Input() get formMode() {
    return this._formMode;
  }
  set formMode(val) {
    this._formMode = val;
  }

  /**
   * FormMode
   * created by nmduy 06/05/2020
   */
  _isDisplayHeader: boolean = true;
  @Input() get isDisplayHeader() {
    return this._isDisplayHeader;
  }
  set isDisplayHeader(val) {
    this._isDisplayHeader = val;
  }


  /**
   * Hiển thị button trên grid
   * @type {boolean}
   * @memberof AmisControlGroupComponent
   */
  _isShowButtonGrid: boolean = true;
  @Input() get isShowButtonGrid() {
    return this._isShowButtonGrid;
  }
  set isShowButtonGrid(val) {
    this._isShowButtonGrid = val;
  }

  /**
   * Hiển thị nodata grid
   * @type {boolean}
   * @memberof AmisControlGroupComponent
   */
  _isShowNodataGrid: boolean = true;
  @Input() get isShowNodataGrid() {
    return this._isShowNodataGrid;
  }
  set isShowNodataGrid(val) {
    this._isShowNodataGrid = val;
  }

  /**
   * Hiển thị nodata grid
   * @type {boolean}
   * @memberof AmisControlGroupComponent
   */
  _validateInfos: any;
  @Input() get validateInfos() {
    return this._validateInfos;
  }
  set validateInfos(val) {
    this._validateInfos = val;
  }

  // Content popup
  @ViewChild("el") el: ElementRef;

  //
  @ViewChild("controlgroup") controlgroup: AmisControlGroupComponent;

  @Input()
  padding: string = "0";

  @Input()
  headerIconClass: string = "icon-edit";

  @Input()
  positionFormDataGrid: string = "";

  @Input()
  masterField: string = "";

  @Input()
  masterIDValue: string = "";

  @Input() inorgeCheckPermission: boolean = false;

  constructor(
  ) {
    super();
  }

  ngOnInit(): void {
  }


  /**
   * Sau khi sủa thông tin từng trườn
   * @param {any} e
   * @memberof AmisControlFormGroupComponent
   * created by vhtruong - 25/05/2020
   */
  afterUpdateDataField(e) {
    this.afterUpdateField.emit(e);
  }

  /**
   * Sự kiện sau khi validate
   * @param {any} e
   * @memberof AmisControlFormGroupComponent
   * created by vhtruong - 25/05/2020
   */
  afterValidated(e) {
    this.afterValidatedForm.emit(e);
  }

  /**
   * Event khi có giá trị field thay đổi
   * @param {*} e 
   * @memberof AmisControlFormGroupComponent
   * created by vhtruong - 05/06/2020
   */
  valueChangedData(e: any) {
    this.valueFieldChanged.emit(e);
  }

  //#region  Xử lý sự kiện khi validate

  /**
  * click không trên popup confirm
  * nmduy 22/06/2020
  */
  onClickNo(e) {
    this.onClickNoEvent.emit(e);
  }


  /**
   * click có trên popup confirm
   * nmduy 22/06/2020
   */
  onClickYes(e) {
    if (e) {
      this.onClickYesEvent.emit(e);
    }
  }

  //#endregion

  /**
   * Nhận sự kiện thay đổi dữ liệu grid
   * created by vhtruong - 21/07/2020
   */
  afterChangedDataGrid(e) {
    this.afterChangeDataGrid.emit(e);
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
   * Thêm vào grid
   */
  addItemIntoGrid(e) {
    this.addItemGrid.emit(e);
  }

}
