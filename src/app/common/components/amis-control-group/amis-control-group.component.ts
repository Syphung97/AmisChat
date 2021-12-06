import { Component, OnInit, Input, Output, EventEmitter, ViewChildren, QueryList, ElementRef, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { GroupConfig } from 'src/app/shared/models/group-config/group-config';
import { AmisControlGroupRowComponent } from './amis-control-group-row/amis-control-group-row.component';
import { GroupType } from 'src/app/shared/enum/group-config/group-type.enum';
import { BaseComponent } from '../base-component';
import { FormMode } from 'src/common/enum/form-mode.enum';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { DependenDictionary } from 'src/app/shared/models/field-dependancy/field-dependancy';
import { DependentData } from 'src/app/shared/models/dependent-data/dependent-data';
import { checkDependentData } from 'src/common/fn/operator-utils';
import { TypeControl } from 'src/app/shared/enum/common/type-control.enum';
import { convertInputFormulaToParams, executeFormula } from 'src/common/fn/expression-parse/fn-formula';
import { AmisStringUtils } from 'src/common/fn/string-utils';
import { AmisDataService } from 'src/common/services/amis-data.service';
import { GroupFieldConfig } from 'src/app/shared/models/group-field-config/group-field-config';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { DependentClone } from 'src/app/shared/models/dependent-clone/dependent-clone';
import { OperatorType } from 'src/common/enum/operator-type.enum';
import { BaseControl } from '../base-control';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { ConfigValidate } from 'src/app/shared/models/config-validate/config-validate';
import { GroupConfigUtils } from 'src/app/shared/function/group-control-utils';
import { TypeShowControl } from 'src/common/models/base/typeShow';
import { TypeEditGrouField } from 'src/app/shared/enum/layout-profile/type-edit-group.enum';
import { EmployeeMySelfService } from 'src/app/services/employee-myself/employee-myself.service';
import { ColumnGroup } from 'src/app/shared/enum/group-config/column-group.enum';

@Component({
  selector: 'amis-amis-control-group',
  templateUrl: './amis-control-group.component.html',
  styleUrls: ['./amis-control-group.component.scss']
})
export class AmisControlGroupComponent extends BaseComponent implements OnInit, OnChanges {

  @Input() DependentDictionaries: DependenDictionary[];

  @Input() DependentDatas: DependentData[];

  @Input() DependentClones: DependentClone[];

  @Input() ConfigValidates: ConfigValidate[];

  @Input() listGroupbox: GroupConfig[];

  @Input() MasterData: any;

  @Input()
  masterField: string = "";

  @Input()
  positionFormDataGrid: string = "";

  @Input()
  masterIDValue: string = "";

  @Input() isUseMasterData: boolean = false;

  @Input() isCallFromEmployeeApp: boolean = false;

  @Input() isCustomHanldeValidateInfos: boolean = false; // tự xử lý cập nhật field những trường hợp nghiệp vụ đặc biệt

  @Output() afterValidatedForm: EventEmitter<any> = new EventEmitter();

  @Output() addItemGrid: EventEmitter<any> = new EventEmitter();

  @Output() eventItemGrid: EventEmitter<any> = new EventEmitter();

  @Output() valueFieldChanged: EventEmitter<any> = new EventEmitter();

  @Output() clickRow: EventEmitter<any> = new EventEmitter();

  @Output() focusOutField: EventEmitter<any> = new EventEmitter();

  // click đồng ý sau khi validate infos trả về
  @Output() onClickYesEvent: EventEmitter<any> = new EventEmitter();

  // output click không trên popup confirm
  @Output() onClickNoEvent: EventEmitter<any> = new EventEmitter();

  // Sự kiện bắn ra khi có thay đổi dữ liệu của grid
  @Output()
  afterChangeDataGrid: EventEmitter<any> = new EventEmitter<any>();

  // là popup confirm hay option
  @Input() isConfirmNotify: boolean = false;

  @Input() inorgeCheckPermission: boolean = false;

  // reload lại dữ liệu groupconfig
  _inputReloadDataGroupConfig: any;
  @Input() get inputReloadDataGroupConfig() {
    return this._inputReloadDataGroupConfig;
  }
  set inputReloadDataGroupConfig(val) {
    if (val) {
      this._inputReloadDataGroupConfig = val;
      this.reloadDataGroupConfig();
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

  @Input()
  set inputAfterSubmit(val) {
    if (val) {
      this.actionAfterSubmit(val);
    }
  }


  /**
   * Input truyền vào để thay đổi cách view dữ liệu
   * @memberof AmisControlGroupComponent
   */
  @Input()
  set inputChangeView(val) {
    if (val) {
      this.changeView(val);
    }
  }

  _typeShow: TypeShowControl;
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
      this._isSubmit = val?.IsSubmit;
      if (this._isSubmit) {
        this.validatedForm();
      }
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

  @Input()
  padding: string = "0px";

  @Input()
  headerIconClass: string = "icon-edit";

  @ViewChild("form")
  form: ElementRef;

  @ViewChildren("groupRow")
  groupRow: QueryList<AmisControlGroupRowComponent>;

  groupType: any = GroupType;

  listFieldInFormula = [];

  listFieldFormula = [];

  listGroupFieldConfig = [];

  listGroupFieldConfigClone = [];

  listDataClone = [];

  listFieldChangeWaiting = [];

  listCurrentInvalidOtherValidate = [];

  listFieldDependentDictionaries: GroupFieldConfig[] = [];

  actionInGrid: any;

  currentItem: any;

  TypeEditGroup = TypeEditGrouField;

  currentField: any;
  // Hiển thị tooltip hay không
  isShowTooltip: boolean;

  // Nơi hiển thị tooltip
  targerTooltip: any;

  // Nội dung tooltip
  tooltipContent: string = "";

  constructor(
    public amisTransferDataService: AmisTransferDataService,
    public amisDataService: AmisDataService,
    public amisTranslateSV: AmisTranslationService,
    public mySelfService: EmployeeMySelfService
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (this.checkInputChange(changes, "listGroupbox")) {
      if (this.listGroupbox?.length) {
        this.setDataForm();
        if (this.DependentDatas?.length) {
          this.setDependentData();
        }
        if (this.DependentClones?.length) {
          this.setDependentClone();
        }
      }
    }

    if (this.checkInputChange(changes, "DependentDatas")) {
      if (this.DependentDatas?.length) {
        this.setDependentData();
      }
    }

    if (this.checkInputChange(changes, "DependentClones")) {
      if (this.DependentClones?.length) {
        this.setDependentClone();
      }
    }

    if (this.checkInputChange(changes, "MasterData")) {
      if (this.MasterData && this.isUseMasterData) {
        this.setDataByMasterData();
        this.setDependentDataWithValue();
      }
    }

  }

  ngOnInit(): void {

    const subBefore = this.amisTransferDataService.beforeEditField.subscribe(res => {
      if (res) {
        this.beforeUpateField(res);
      }
    })

    this.unSubscribles.push(subBefore);

  }


  /**
   * Kiểm tra thay đổi theo tên biến
   * @param {SimpleChanges} changes
   * @param {any} inputName
   * @returns
   * @memberof AmisControlGroupComponent
   * created by vhtruong - 02/06/2020
   */
  checkInputChange(changes: SimpleChanges, inputName) {
    const inputChange = changes[inputName];
    return (
      inputChange && inputChange.previousValue !== inputChange.currentValue
    );
  }


  /**
   * Set Data lúc đầu mở form
   * @memberof AmisControlGroupComponent
   * created by vhtruong - 02/06/2020
   */
  setDataForm() {
    this.listGroupFieldConfig = [];
    this.listFieldDependentDictionaries = [];
    this.listGroupbox.forEach(g => {
      this.setDataGroupConfig(g);
    })
    if (this.DependentDictionaries?.length) {
      this.DependentDictionaries.forEach(dd => {
        let index = this.listGroupFieldConfig.findIndex(gfc => gfc.FieldName === dd.FieldName);
        if (index != -1) {
          this.listGroupFieldConfig[index].GroupFieldConfigDependent = this.listGroupFieldConfig.filter(gg => gg.FieldName == dd.DependentField);
        }
      })
    }
    // this.setFormulaValue();
  }


  /**
   * Set Data GroupConfig lúc đầu mở form
   * @param {GroupConfig} g
   * @memberof AmisControlGroupComponent
   * created by vhtruong - 02/06/2020
   */
  setDataGroupConfig(g: GroupConfig) {

    // Hiển thị hết dữ liệu group
    if (g.IsExpand === null || g.IsExpand === undefined || g.IsExpand) {
      g.IsShowExpand = true;
      g.IsLoadedData = true;
    }

    if (g.DataGroupConfig?.length) {
      g.UpdatedDataGroupConfig = [];
      if (this.isCallFromEmployeeApp) {
        for (let index = 0; index < g.DataGroupConfig.length; index++) {
          const element = AmisCommonUtils.cloneData(g.DataGroupConfig[index]);
          if (element.State == FormMode.Update && element.UpdatedFields) {
            g.UpdatedDataGroupConfig.push(element.UpdatedFields);
          } else {
            g.UpdatedDataGroupConfig.push(element);
          }
        }
      }
    }

    // Xử lý hiển thị field theo các cột
    if (g.GroupType === GroupType.Field) {
      if (g.ColumnGroup === ColumnGroup.TwoCol) {
        g.ColOne = [];
        g.ColTwo = [];
      } else if (g.ColumnGroup === ColumnGroup.OneCol) {
      }
    } else if (g.GroupType === GroupType.Grid) {
      g.ColOne = [];
      g.ColTwo = [];
      if (!g.IsSystem) {
        if (g.GroupFieldConfigs?.length >= 10) {
          g.ColOne.push(...g.GroupFieldConfigs.filter(function name(params, index) {
            if (index < g.GroupFieldConfigs.length / 2) {
              return true;
            }
            return false;
          }));
          g.ColTwo.push(...g.GroupFieldConfigs.filter(function name(params, index) {
            if (index >= g.GroupFieldConfigs.length / 2) {
              return true;
            }
            return false;
          }));
          g.ColumnGroup = 2;
        }
      }
    }

    // duyệt group field config
    g.GroupFieldConfigs?.forEach(gf => {
      if (g.GroupType == GroupType.Grid && this.isCallFromEmployeeApp) { // nếu kiểu grid gọi từ app nhân viên thì mặc định hiển thị hết cột
        gf.IsVisible = true;
      }
      if(!this.isUseMasterData){
        gf.OldValue = gf.Value;
      }
      if (this.listGroupFieldConfig.findIndex(l => l.FieldName == gf.FieldName) == -1) {
        if (gf.ColumnIndex == 1) {
          g.ColOne?.push(gf);
        } else if (gf.ColumnIndex == 2) {
          if (g.ColumnGroup != ColumnGroup.TwoCol) {
            g.ColumnGroup = ColumnGroup.TwoCol;
          }
          g.ColTwo?.push(gf);
        }
        if (g.GroupType == GroupType.Field) {
          this.listGroupFieldConfig.push(gf);
        }
        if (this._formMode === FormMode.Insert || this._formMode == FormMode.Duplicate) {
          if (gf.DefaultValue) {
            let objDefault = JSON.parse(gf.DefaultValue);
            gf.Value = objDefault[gf.FieldName];
            gf.ValueText = objDefault[gf.DisplayField];
          }
        }
        // if (this.isUseMasterData && this.MasterData && this.MasterData[gf.FieldName]) {
        //   gf.Value = this.MasterData[gf.FieldName];
        //   if (gf.DisplayField) {
        //     gf.ValueText = this.MasterData[gf.DisplayField];
        //   }
        // }
        if (gf.PermissionConfig) {
          let permissionConfig = JSON.parse(gf.PermissionConfig);
          if (permissionConfig) {
            gf.PermissionConfigObject = permissionConfig;
          }
        }

        // Xử lý custom config
        if (gf.CustomConfig) {
          try {
            let dataCustom = JSON.parse(gf.CustomConfig);
            gf.MinValue = dataCustom["MinValue"];
            gf.MaxValue = dataCustom["MaxValue"];
            gf.MinLength = dataCustom["MinLength"];
            gf.MaxLength = dataCustom["MaxLength"];
            gf.DataCustomConfig = dataCustom;
            if (gf.DataCustomConfig) {
              if (gf.DataCustomConfig["View"] && this._formMode === FormMode.View) {
                for (let it in gf.DataCustomConfig["View"]) {
                  gf[it] = gf.DataCustomConfig["View"][it];
                }
              }
              if (gf.DataCustomConfig["Insert"] && this._formMode === FormMode.Insert) {
                for (let it in gf.DataCustomConfig["Insert"]) {
                  gf[it] = gf.DataCustomConfig["Insert"][it];
                }
              }
              if (gf.DataCustomConfig["Update"] && this._formMode === FormMode.Update) {
                for (let it in gf.DataCustomConfig["Update"]) {
                  gf[it] = gf.DataCustomConfig["Update"][it];
                }
              }
              switch (gf.TypeControl) {
                case TypeControl.Formula:
                  const paramCustomConfig = gf.DataCustomConfig.FormulaConfig;
                  if (paramCustomConfig.Content) {
                    const fieldFormula = convertInputFormulaToParams(paramCustomConfig.Content);
                    if (fieldFormula?.length) {
                      this.listFieldFormula.push({
                        FieldName: gf.FieldName,
                        Content: paramCustomConfig.Content,
                        TypeControl: paramCustomConfig.Type,
                        ListFieldInFormula: fieldFormula
                      });
                      fieldFormula.forEach(ff => {
                        this.listFieldInFormula.push({
                          FieldName: ff,
                          FieldFormula: gf.FieldName
                        })
                      })
                    }
                  }
                  break;
              }
            }
          } catch (ex) {

          }
        }
        gf.ValidateMethod = GroupConfigUtils.GenerateValidateMethod(gf);
      }
    })
    this.getCustomGroupConfig(g);
    if (g.ListGroupConfigChild?.length) {
      g.ListGroupConfigChild.forEach(t => {
        if(this.listGroupbox.findIndex(gr => gr.GroupConfigID === t.GroupConfigID) === -1){
          t.IsChild = true;
          this.listGroupbox.push(t);
          this.setDataGroupConfig(t);
        }
      })
    }
  }

  /**
   * Lấy thông tin trong custom config
   * nmduy 21/07/2020
  */
  getCustomGroupConfig(groupbox: GroupConfig) {
    if (groupbox?.CustomConfig) {
      const customConfig = JSON.parse(groupbox?.CustomConfig);
      if (customConfig) {
        groupbox.CustomConfigObject = customConfig;
        if (customConfig?.hasOwnProperty('IsNotAddable')) {
          groupbox.IsNotAddable = true;
        }
        if (customConfig?.hasOwnProperty('IsVerticalTab')) {
          groupbox.IsVerticalTab = true;
        }
      }
    }
    if (groupbox?.PermissionConfig) {
      const permissionConfig = JSON.parse(groupbox?.PermissionConfig);
      if (permissionConfig) {
        groupbox.PermissionConfigObject = permissionConfig;
      }
    }
  }

  /**
   * Set dữ liệu các trường phụ thuộc trong lần đầu mở form
   * @memberof AmisControlGroupComponent
   * created by vhtruong - 02/06/2020
   */
  setDependentData() {
    this.DependentDatas.forEach(d => {
      if (d.Config) {
        try {
          d.ListParam = [];
          const param = JSON.parse(d.Config);
          if (param?.length) {
            d.ListParam.push(...param);
          }
        }
        catch (ex) {
          console.log(ex);
        }
      }
    })
    if(!this.isUseMasterData){
      this.setDependentDataWithValue();
    }

  }


  /**
   * Set value cho các giá trị liên quan
   * @memberof AmisControlGroupComponent
   */
  setDependentDataWithValue(){
    const data = this.listGroupFieldConfig.filter(t => this.DependentDatas.findIndex(lf => lf.FieldName === t.FieldName) !== -1);
    data?.forEach(da => {
      this.DependentDatas.forEach(dd => {
        if (dd.FieldName == da.FieldName) {
          if (checkDependentData(da.Value, da.DataType, dd.Operator, dd.Value)) {
            this.changeFieldDependentData(dd.ListParam);
          }
        }
      })
    });
  }


  /**
   * Xử lý ban đầu danh sách các trường copy
   * @memberof AmisControlGroupComponent
   * created by vhtruong - 04/06/2020
   */
  setDependentClone() {
    this.DependentClones.forEach(e => {
      if (e.ListFieldDependancy?.length) {
        e.ListFieldDependancy.forEach(f => {
          this.listDataClone.push({
            FieldCopy: f.FieldName1,
            FieldPaste: f.FieldName2,
            FieldParent: e.FieldName,
            ValueParent: e.Value
          });
        })
      }
    })
  }


  /**
   * Set giá trị cho kiểu công thức
   * @memberof AmisControlGroupComponent
   * created by vhtruong - 02/06/2020
   */
  setFormulaValue() {
    if (this.listFieldFormula?.length) {
      this.listFieldFormula.forEach(e => {
        this.setFormulaValueDetail(e);
      })
    }
  }


  /**
   *
   * @param {any} e object {
                    FieldName // Tên trường,
                    Content // Nội dung công thức,
                    TypeControl // Type control,
                    ListFieldInFormula: // Danh sách các trường tạo lên công thức
                  }
   * @memberof AmisControlGroupComponent
   */
  setFormulaValueDetail(e) {
    let index = this.listGroupFieldConfig.findIndex(gf => gf.FieldName == e.FieldName);
    if (index != -1) {
      const normalizeParamsObj = this.setNormalizeParams(
        e.ListFieldInFormula,
        e.Content,
        this.listGroupFieldConfig
      );
      const normalizeParams = normalizeParamsObj.normalizeParams;
      let value = executeFormula(normalizeParamsObj.text, normalizeParams);
      if (typeof value === "string") {
        this.listGroupFieldConfig[index].Value = value.trim();
        if (value.trim() != this.listGroupFieldConfig[index].OldValue) {
          this.listGroupFieldConfig[index].State = FormMode.Update; // nmduy: trường công thức không bắn event value change nên gán state Update ở đây
        } else {
          this.listGroupFieldConfig[index].State = FormMode.None;
        }
      } else {
        this.listGroupFieldConfig[index].Value = value;
        this.checkValueGroupFieldChange(this.listGroupFieldConfig[index], value);
      }
    }
  }


  /**
   * Set value cho các control từ master data
   * @memberof AmisControlGroupComponent
   */
  setDataByMasterData(){
    if(this.listGroupFieldConfig?.length){
      this.listGroupFieldConfig.forEach(gf => {
        gf.ID = this.MasterData[this.masterField];
        if (this.MasterData[gf.FieldName]) {
          gf.Value = this.MasterData[gf.FieldName];
          gf.OldValue = gf.Value;
          if (gf.DisplayField) {
            gf.ValueText = this.MasterData[gf.DisplayField];
          }
        }
      })
    }
  }

  /**
   * Kiểm tra giá trị group field bị thay đổi để cập nhật trạng thái
   * nmduy 05/10/2020
   */
  checkValueGroupFieldChange(gf, newValue) {
    if (!checkDependentData(newValue, gf.DataType, OperatorType.Equal, gf.OldValue)) {
      gf.State = FormMode.Update; // nmduy: trường công thức không bắn event value change nên gán state Update ở đây
    } else {
      gf.State = FormMode.None;
    }
  }
  /**
   *
   *
   * @param {any} params
   * @param {any} text
   * @param {any} fields
   * @returns
   * @memberof AmisControlGroupComponent
   */
  setNormalizeParams(params, text, fields) {
    const returnValue = {
      normalizeParams: [],
      text: text
    };
    params?.forEach(element => {
      const field = fields.find(p => p.FieldName === element);
      let data = "";

      let fieldType = null;
      if (field) {
        fieldType = field.TypeControl;
      }

      if (fieldType == TypeControl.Combobox) {
        data = field.ValueText;
      } else if (fieldType == TypeControl.DefaultType || fieldType == TypeControl.OneRow || fieldType == TypeControl.Hyperlink) {
        data = field.Value ? field.Value.trim() : field.Value;
      } else {
        data = field.Value;
      }

      returnValue.normalizeParams.push({
        param: "_" + element.trim(),
        data: data
      });
      returnValue.text = returnValue.text.replaceAll(
        "${" + element + "}",
        "_" + AmisStringUtils.convertVNtoEN(element.replaceAll(/\ /g, "_"))
      );
    });
    return returnValue;
  }

  /**
   * Sự kiện validate form
   * @memberof AmisControlGroupComponent
   * created by vhtruong - 08/05/2020
   */
  validatedForm() {
    const validateList: any = [];
    this.groupRow?.forEach(row => {
      if (!row.isValidField()) {
        validateList.push(row);
      }
    });
    if (this.ConfigValidates?.length) {
      this.ConfigValidates.forEach(of => {
        if (this.listCurrentInvalidOtherValidate?.findIndex(cof => cof.FieldName == of.FieldSource) === -1) {
          let indexF = this.listGroupFieldConfig.findIndex(gf => gf.FieldName == of.FieldSource);
          let indexV = this.listGroupFieldConfig.findIndex(gf => gf.FieldName == of.FieldValidate);
          if (indexF != -1 && indexV != -1) {
            if (!checkDependentData(this.listGroupFieldConfig[indexF].Value, this.listGroupFieldConfig[indexF].DataType, of.Operator, this.listGroupFieldConfig[indexV].Value)) {
              this.listGroupFieldConfig[indexF].IsShowError = true;
              this.listGroupFieldConfig[indexF].IsErrorCustom = true;
              this.listGroupFieldConfig[indexF].ErrorMessage = this.generateErrorMessageCustom(this.listGroupFieldConfig[indexF].Caption, of.Operator, this.listGroupFieldConfig[indexV].Caption);
              this.listCurrentInvalidOtherValidate.push({
                FieldSource: of.FieldSource,
                FieldValidate: of.FieldValidate
              });
              validateList.push(this.listGroupFieldConfig[indexF]);
            }
          }
        }
      })
    }
    this.afterValidatedForm.emit(validateList);
    if (validateList.length > 0) {
      this.focusFirstError();
    }

  }


  /**
   * Validate một trường dữ liệu theo các trường dữ liệu khác
   * @param {GroupFieldConfig} e
   * @memberof AmisControlGroupComponent
   * created by vhtruong - 08/06/2020
   */
  validateOtherField(e: GroupFieldConfig) {
    const listField = this.ConfigValidates?.filter(fv => fv.FieldSource == e.FieldName || fv.FieldValidate == e.FieldName);
    if (listField?.length) {
      for (let i = 0; i < listField.length; i++) {
        const of = listField[i];
        let indexF = this.listGroupFieldConfig.findIndex(gf => gf.FieldName == of.FieldSource);
        let indexV = this.listGroupFieldConfig.findIndex(gf => gf.FieldName == of.FieldValidate);
        if (indexF != -1 && indexV != -1) {
          if (!checkDependentData(this.listGroupFieldConfig[indexF].Value, this.listGroupFieldConfig[indexF].DataType, of.Operator, this.listGroupFieldConfig[indexV].Value)) {
            this.listGroupFieldConfig[indexF].IsErrorCustom = true;
            this.listGroupFieldConfig[indexF].ErrorMessage = this.generateErrorMessageCustom(this.listGroupFieldConfig[indexF].Caption, of.Operator, this.listGroupFieldConfig[indexV].Caption);
            this.listCurrentInvalidOtherValidate.push({
              FieldSource: of.FieldSource,
              FieldValidate: of.FieldValidate
            });
            return;
          }
          this.listGroupFieldConfig[indexF].IsErrorCustom = false;
        }
      }
    }
  }

  /**
   * Focus ô lỗi đầu tiên
   * @memberof AmisControlGroupComponent
   * created by vhtruong - 08/05/2020
   */
  focusFirstError() {
    setTimeout(() => {
      const invalidControl = this.form?.nativeElement?.querySelector('.border-error');

      if (invalidControl) {
        if (invalidControl instanceof (HTMLInputElement)) {
          invalidControl.focus();
          return;
        }
        const lstInput = invalidControl.querySelectorAll('input');
        if (lstInput.length > 0) {
          for (let i = 0; i < lstInput.length; i++) {
            if (lstInput[i].getAttribute('type') !== "hidden") {
              lstInput[i].focus();
              return;
            }
          }
        }
      }
    }, 0);
  }


  /**
   * Focus ô input đầu tiên
   * @memberof AmisControlGroupComponent
   * created by vhtruong - 05/06/2020
   */
  focusFirstInput() {
    setTimeout(() => {
      const control = this.form?.nativeElement;

      if (control) {
        if (control instanceof (HTMLInputElement) || control instanceof (HTMLTextAreaElement)) {
          control.focus();
          return;
        }
        const lstInput = control.querySelectorAll('input, textarea');
        if (lstInput.length > 0) {
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < lstInput.length; i++) {
            if (lstInput[i].getAttribute('type') !== "hidden" && !lstInput[i].getAttributeNames().includes("disabled")) {
              lstInput[i].focus();
              return;
            }
          }
        }
      }
    }, 100);
  }



  /**
   * Sự kiện khi model thay đổi ( chưa tối ưu cần sửa trong thời gian tới)
   * @param {*} e
   * @memberof AmisControlGroupComponent
   */
  valueChangedData(e: any) {
    this.valueFieldChanged.emit(e);
    if (this._formMode != FormMode.View) {

      if (this.DependentDatas?.length || this.DependentDictionaries?.length) {
        this.changeFieldDependancy(e, e?.Data);
      }
      if (this.listFieldInFormula?.length) {
        let data = this.listFieldInFormula.find(t => t.FieldName == e.FieldName)
        if (data) {
          const dataobject = this.listFieldFormula.find(m => m.FieldName === data.FieldFormula);
          this.setFormulaValueDetail(dataobject);
        }
      }
      if (this.DependentClones?.length && this.listDataClone?.length) {
        this.changeFieldClone(e, e?.Data);
      }

      if (this._isSubmit) {
        this.validateOtherField(e?.Data);
      }
    }
  }

  /**
   * Hiển thị nội dung
   *
   **/
  changeShowExpand(groupbox: GroupConfig) {
    groupbox.IsShowExpand = !groupbox.IsShowExpand;
    if (groupbox.IsShowExpand && !groupbox.IsLoadedData) {
      this.getDataByGroupConfig(groupbox)
    }
  }


  /**
   * Lấy dữ liệu về cho groupconfig
   * @param {GroupConfig} groupbox 
   * @memberof AmisControlGroupComponent
   */
  getDataByGroupConfig(groupbox: GroupConfig) {
    if (this._formMode !== FormMode.Insert && this._formMode !== FormMode.Duplicate) {
      let group = AmisCommonUtils.cloneData(groupbox);
      group.IsExpand = true;
      let param = {
        GroupConfigs: [group],
        MasterFieldValue: this.masterIDValue
      }
      if (this.isCallFromEmployeeApp) {
        this.mySelfService.getDataByGroupConfigs(param).subscribe(res => {
          if (res?.Success && res.Data?.length) {
            if (groupbox.GroupType === GroupType.Grid) {
              groupbox.DataGroupConfig = res.Data[0].DataGroupConfig === null || res.Data[0].DataGroupConfig === undefined ? AmisCommonUtils.cloneDataArray([]) : AmisCommonUtils.cloneDataArray(res.Data[0].DataGroupConfig);
            } else {
              groupbox.GroupFieldConfigs = res.Data[0].GroupFieldConfigs;
            }
            groupbox.IsLoadedData = true;
          }
        });
      } else {
        this.amisDataService.getDataByGroupConfigs(param).subscribe(res => {
          if (res?.Success && res.Data?.length) {
            if (groupbox.GroupType === GroupType.Grid) {
              groupbox.DataGroupConfig = res.Data[0].DataGroupConfig === null || res.Data[0].DataGroupConfig === undefined ? AmisCommonUtils.cloneDataArray([]) : AmisCommonUtils.cloneDataArray(res.Data[0].DataGroupConfig);
            } else {
              groupbox.GroupFieldConfigs = res.Data[0].GroupFieldConfigs;
            }
            groupbox.IsLoadedData = true;
          }
        });
      }
    }
  }


  /**
   * reload lại dữ liệu group config
   * @memberof AmisControlGroupComponent
   */
  reloadDataGroupConfig() {
    if (this._inputReloadDataGroupConfig?.GroupConfigCode) {
      let group = this.listGroupbox.find(g => g.GroupConfigCode === this._inputReloadDataGroupConfig.GroupConfigCode);
      if (group?.IsLoadedData) {
        this.getDataByGroupConfig(group);
      }
    }
  }

  /**
   * Sau khi cập nhật trường
   * @param {any} e
   * @memberof AmisControlGroupComponent
   * created by vhtruong - 14/05/2020
   */
  updatedField(e) {
    if (e) {
      if (this._formMode === FormMode.View) {
        this.currentItem = e.Item;
        this.currentField = e.Field;
        this.AfterUpdateFieldInFormView(e.Item, e.Field);
      }
    }
  }

  /**
   * Sau khi cập nhật giá trị hiển thị của trường dữ liệu
   * @param {any} e 
   * @memberof AmisControlGroupRowComponent
   * created by nmduy 12/06/2020
   */
  updatedFieldView(e) {
    this.afterUpdateField.emit(e.Item);
  }

  /**
   * Tự động cancel khi sửa một thông tin khác
   * @param {any} e
   * @memberof AmisControlGroupComponent
   * created by vhtruong - 19/05/2020
   */
  beforeUpateField(obj) {
    this.groupRow?.forEach(e => {
      e.beforeEditValue(obj);
    })
  }


  /**
   * Thêm dữ liệu vào bảng
   * @param {any} groupbox
   * @memberof AmisControlGroupComponent
   * created by vhtruong - 21/05/2020
   */
  addItemIntoGrid(groupbox, event) {
    event.stopPropagation();
    this.actionInGrid = AmisCommonUtils.cloneData({
      Action: FormMode.Insert,
      GroupConfig: groupbox
    });
    if (groupbox.IsNotUseDefaultFromDataGrid) {
      return;
    }
  }


  /**
   * 
  **/
  onAddItemGrid(e) {
    this.addItemGrid.emit(e);
  }


  /**
   * Kiểm tra trường liên quan
   * @param {any} e
   * @memberof AmisControlGroupComponent
   * created by vhtruong - 22/05/2020
   */
  changeFieldDependancy(e, groupFieldConfig) {

    // Xử lý các value liên quan đến giá trị field khác( vd: chọn tỉnh huyện xã)
    let listFieldDepen = [];
    if (!groupFieldConfig.IsReadOnly) {
      listFieldDepen = this.DependentDictionaries.filter(d => d.DependentField == e.FieldName);
    }

    // Các trường giá tri liên quan đến nhau
    const listDepenData = this.DependentDatas.filter(d => d.FieldName == e.FieldName);
    const dependentDatas = [];
    if (listDepenData?.length) {
      listDepenData.forEach(d => {
        if (checkDependentData(groupFieldConfig?.Value, groupFieldConfig?.DataType, d.Operator, d.Value)) {
          if (d.Config) {
            try {
              const param = JSON.parse(d.Config);
              if (param?.length) {
                dependentDatas.push(...param);
              }
            }
            catch (ex) {
              console.log(ex);
            }
          }
        }
      })
    }

    if (listFieldDepen?.length) {
      this.changeFieldWithDependency(listFieldDepen);
    }

    if (dependentDatas?.length) {
      this.changeFieldDependentData(dependentDatas);
    }
  }

  /**
   * Xử lý thay đổi dữ liệu liên quan trong dependent-dictionary
   * @param {any} [listFieldDepen=[]]
   * @memberof AmisControlGroupComponent
   * created by vhtruong - 02/06/2020
   */
  changeFieldWithDependency(listFieldDepen = []) {
    const data = this.listGroupFieldConfig.filter(t => listFieldDepen.findIndex(lf => lf.FieldName === t.FieldName) !== -1);
    data?.forEach(gf => {
      if (listFieldDepen.findIndex(lf => lf.FieldName === gf.FieldName) !== -1) {
        gf.Value = null;
        gf.ValueText = null;
        gf.IsReloadData = true;
        this.checkValueGroupFieldChange(gf, null);
      }
    })

  }

  /**
   * Xử lý thay đổi dữ liệu liên quan trong dependent-data
   * @param {any} [dependentDatas=[]]
   * @memberof AmisControlGroupComponent
   * created by vhtruong - 02/06/2020
   */
  changeFieldDependentData(dependentDatas = []) {
    const data = this.listGroupFieldConfig.filter(t => dependentDatas.findIndex(lf => lf.FieldName === t.FieldName) !== -1);
    data?.forEach(gf => {
      dependentDatas.forEach(dd => {
        if (dd.FieldName == gf.FieldName) {
          for (let item in dd) {
            if (item !== "FieldName") {
              gf[item] = dd[item];
              if (item === "Value") {
                this.checkValueGroupFieldChange(gf, dd[item]);
              }
            }
          }
        }
        gf.ValidateMethod = GroupConfigUtils.GenerateValidateMethod(gf);
      })
    })

  }


  /**
   * Xử lý khi có một trường thay đổi trong trường dữ liệu copy
   * @param {any} e
   * @param {any} groupFieldConfig
   * @memberof AmisControlGroupComponent
   * created by vhtruong - 04/06/2020
   */
  changeFieldClone(e, groupFieldConfig) {

    let indexParent = this.DependentClones?.findIndex(t => t.FieldName === e.FieldName);

    if (indexParent !== -1) {
      let data = this.DependentClones[indexParent];
      if (checkDependentData(groupFieldConfig.Value, groupFieldConfig.DataType, data.Operator, data.Value)) {
        if (data?.ListFieldDependancy?.length) {
          data?.ListFieldDependancy.forEach(f => {
            let indexField1 = this.listGroupFieldConfig.findIndex(gf => gf.FieldName === f.FieldName1);
            let indexField2 = this.listGroupFieldConfig.findIndex(gf => gf.FieldName === f.FieldName2);
            this.listGroupFieldConfig[indexField2].Value = this.listGroupFieldConfig[indexField1].Value;
            this.listGroupFieldConfig[indexField2].ValueText = this.listGroupFieldConfig[indexField1].ValueText;
            this.listGroupFieldConfig[indexField2].IsReloadData = true;
            this.checkValueGroupFieldChange(this.listGroupFieldConfig[indexField2], this.listGroupFieldConfig[indexField1].Value);
          })
        }
      }
    }

    let indexCopy = this.listDataClone?.findIndex(dc => dc.FieldCopy === e.FieldName);
    if (indexCopy !== -1) {

      let dataCloneCopy = this.listDataClone[indexCopy];
      let indexP = this.DependentClones?.findIndex(dp => dp.FieldName === dataCloneCopy.FieldParent);

      if (indexP !== -1) {
        let dataP = this.DependentClones[indexP];
        let groupConfigP = this.listGroupFieldConfig.find(gfc => gfc.FieldName === dataP.FieldName);
        if (checkDependentData(groupConfigP?.Value, groupConfigP?.DataType, dataP.Operator, dataP.Value)) {
          let indexField2 = this.listGroupFieldConfig.findIndex(gf => gf.FieldName === dataCloneCopy.FieldPaste);
          this.listGroupFieldConfig[indexField2].Value = groupFieldConfig.Value;
          this.listGroupFieldConfig[indexField2].ValueText = groupFieldConfig.ValueText;
          this.listGroupFieldConfig[indexField2].IsReloadData = true;
          this.checkValueGroupFieldChange(this.listGroupFieldConfig[indexField2], groupFieldConfig.Value);
        }
      }
    }

    let indexPaste = this.listDataClone?.findIndex(dc => dc.FieldPaste === e.FieldName);
    if (indexPaste !== -1) {

      let dataClonePaste = this.listDataClone[indexPaste];
      let groupConfigCopy = this.listGroupFieldConfig.find(gfc => gfc.FieldName === dataClonePaste.FieldCopy);

      if (groupFieldConfig.Value !== groupConfigCopy.Value) {
        let indexP = this.DependentClones?.findIndex(dp => dp.FieldName === dataClonePaste.FieldParent);

        if (indexP !== -1) {
          let dataP = this.DependentClones[indexP];
          let groupConfigP = this.listGroupFieldConfig.find(gfc => gfc.FieldName === dataP.FieldName);
          if (checkDependentData(groupConfigP?.Value, groupConfigP?.DataType, dataP.Operator, dataP.Value)) {
            groupConfigP.Value = !groupConfigP.Value;
            this.checkValueGroupFieldChange(groupConfigP, !groupConfigP.Value);
          }
        }
      }
    }

  }

  /**
   * Nhận sự kiện từ grid
   * @memberof AmisControlGroupComponent
   * created by vhtruong - 26/05/2020
   */
  eventInGrid(e) {
    if (e) {
      this.eventItemGrid.emit(e);
    }
  }


  /**
   * Cập nhật nhiều field
   * @returns
   * @memberof AmisControlGroupComponent
   */
  updateFieldData(param: GroupFieldConfig, field: BaseControl) {
    const me = this;
    param = AmisCommonUtils.trimProperties(param);
    me.amisDataService.updateField(param.SubsystemCode, param).subscribe(res => {
      if (res?.Success) {

        field._isViewOnly = true;
        field._isViewEditable = true;
        me.amisTransferDataService.showSuccessToast(me.amisTranslateSV.getValueByKey("CONTROL_UPDATE_FIELD_SUCCESS"));

        me.afterUpdateField.emit(param);
        return;
      } else {
        if (res?.ValidateInfo?.length) {
          this.validateInfos = res.ValidateInfo;
          return;
        }
      }
      me.amisTransferDataService.showErrorToast();
    }, error => {
      me.amisTransferDataService.showErrorToast();
    })
  }

  /**
   * Cập nhật nhiều field
   * @param {GroupFieldConfig} param
   * @memberof AmisControlGroupComponent
   */
  updateMultiFieldData(groupField: GroupFieldConfig, param: Array<GroupFieldConfig>, field: BaseControl) {
    const me = this;
    let dataRequest = [];
    dataRequest.push(groupField);
    param.forEach(p => {
      let obj = this.listGroupFieldConfig.find(gfc => gfc.FieldName === p.FieldName && gfc.FieldName != groupField.FieldName);
      if (obj && p.Value != obj.Value) {
        p = AmisCommonUtils.trimProperties(p);
        dataRequest.push(p);
      }
    })
    if (dataRequest.length > 1) {
      this.amisDataService.updateMultiField(groupField.SubsystemCode, dataRequest).subscribe(res => {
        if (res?.Success) {

          me.afterUpdateField.emit(groupField);

          field._isViewOnly = true;
          field._isViewEditable = true;
          me.amisTransferDataService.showSuccessToast(me.amisTranslateSV.getValueByKey("CONTROL_UPDATE_FIELD_SUCCESS"));

          const index = this.listGroupFieldConfig.findIndex(t => t.FieldName == groupField.FieldName);
          if (index != -1) {
            this.listGroupFieldConfig[index].Value = groupField.Value;
            this.listGroupFieldConfig[index].ValueText = groupField.ValueText;
            this.listGroupFieldConfig[index].IsReloadData = groupField.IsReloadData;
            this.listGroupFieldConfig[index].IsReadOnly = groupField.IsReadOnly;
          }

          param.forEach(e => {
            const ind = this.listGroupFieldConfig.findIndex(t => t.FieldName == e.FieldName);
            if (ind != -1) {
              for (let item in e) {
                if (item !== "FieldName") {
                  this.listGroupFieldConfig[ind][item] = e[item];
                }
              }
            }
          })

          return;
        } else {
          // if (res?.ValidateInfo?.length) {
          //   if (res.ValidateInfo[0].Code == ErrorCode.DULICATEDATA) {
          //     me.item.IsErrorCustom = true;
          //     me.item.ErrorMessage = `${groupField.Caption} ${me.amisTranslateSV.getValueByKey("DUPLICATE_DATA_CONTENT")}`;
          //   } else {
          //     me.amisTransferDataService.showErrorToast();
          //   }
          //   field.focusInput();
          //   return;
          // }
        }
        me.amisTransferDataService.showErrorToast();
      }, error => {
        me.amisTransferDataService.showErrorToast();
      })
    } else {
      this.amisDataService.updateField(groupField.SubsystemCode, groupField).subscribe(res => {
        if (res?.Success) {

          me.afterUpdateField.emit(groupField);

          field._isViewOnly = true;
          field._isViewEditable = true;
          me.amisTransferDataService.showSuccessToast(me.amisTranslateSV.getValueByKey("CONTROL_UPDATE_FIELD_SUCCESS"));

          const index = this.listGroupFieldConfig.findIndex(t => t.FieldName == groupField.FieldName);
          if (index != -1) {
            this.listGroupFieldConfig[index].Value = groupField.Value;
            this.listGroupFieldConfig[index].ValueText = groupField.ValueText;
            this.listGroupFieldConfig[index].IsReloadData = groupField.IsReloadData;
          }

          param.forEach(e => {
            const ind = this.listGroupFieldConfig.findIndex(t => t.FieldName == e.FieldName);
            if (ind != -1) {
              for (let item in e) {
                if (item !== "FieldName") {
                  this.listGroupFieldConfig[ind][item] = e[item];
                }
              }
            }
          })

          return;
        } else {
          // if (res?.ValidateInfo?.length) {
          //   if (res.ValidateInfo[0].Code == ErrorCode.DULICATEDATA) {
          //     param.IsErrorCustom = true;
          //     param.ErrorMessage = `${param.Caption} ${me.amisTranslateSV.getValueByKey("DUPLICATE_DATA_CONTENT")}`;
          //   } else {
          //     me.amisTransferDataService.showErrorToast();
          //   }
          //   field.focusInput();
          //   return;
          // }
        }
        me.amisTransferDataService.showErrorToast();
      }, error => {
        me.amisTransferDataService.showErrorToast();
      })
    }
  }


  /**
   * Sự kiện truyền từ component cha vào khi gọi lên server hoặc submit xong
   * @param {any} obj
   * @memberof AmisControlGroupComponent
   * created by vhtruong - 04/06/2020
   */
  actionAfterSubmit(obj) {
    if (obj?.IsError) {
      this.focusFirstError();
    }
    if (obj?.IsFocusFirstItem) {
      this.focusFirstInput();
    }
  }


  /**
   * Nhận sự kiện thay đổi giá trị kèm giá trị trường khác
   * @param {any} e
   * @memberof AmisControlGroupComponent
   */
  afterChangedWihFieldAndValue(e) {
    if (this._formMode !== FormMode.View) {
      if (e?.ListFieldChange?.length) {
        e.ListFieldChange.forEach(t => {
          let index = this.listGroupFieldConfig.findIndex(gf => gf.FieldName == t.FieldName);
          if (index != -1) {
            this.listGroupFieldConfig[index].Value = t.Value;
            this.listGroupFieldConfig[index].ValueText = t.ValueText;
            this.listGroupFieldConfig[index].IsReloadData = true;
            this.checkValueGroupFieldChange(this.listGroupFieldConfig[index], t.Value);
          }
        })
      }
    } else {
      this.listFieldChangeWaiting = [];
      this.listFieldChangeWaiting.push(e);
    }
  }




  /**
   * Sự kiện click vào 1 dòng
   * @param {any} e
   * @memberof AmisControlGroupComponent
   * created by vhtruong - 05/06/2020
   */
  onClickRow(e) {
    this.clickRow.emit(e);
  }


  /**
   * Sinh câu báo lỗi tự động
   * @memberof AmisControlGroupComponent
   * created by vhtruong - 08/06/2020
   */
  generateErrorMessageCustom(text1, operator, text2) {
    return `${text1} ${this.generateTextByOperator(operator)} ${text2}`;
  }


  /**
   * Sinh câu text từ toán tử so sánh
   * @param null operator
   * @returns
   * @memberof AmisControlGroupComponent
   */
  generateTextByOperator(operator: OperatorType) {
    switch (operator) {
      case OperatorType.Equal:
        return "phải bằng";
        break;
      case OperatorType.GreaterThan:
        return "phải lớn hơn";
        break;
      case OperatorType.GreaterOrEqual:
        return "phải lớn hơn hoặc bằng";
        break;
      case OperatorType.LessThan:
        return "phải nhỏ hơn";
        break;
      case OperatorType.LessOrEqual:
        return "phải nhỏ hơn hoặc bằng";
        break;
      case OperatorType.None:
        return "phải bằng";
        break;
      case OperatorType.NotBetween:
        return "phải bằng";
        break;
      case OperatorType.NotEqual:
        return "phải khác";
        break;
      case OperatorType.Contains:
        return "phải chứa";
        break;
      case OperatorType.NotContains:
        return "phải không chứa";
        break;
      case OperatorType.IsNullOrEmpty:
        return "phải bằng";
        break;
      case OperatorType.HasValue:
        return "phải bằng";
        break;
    }
  }

  //#region Xử lý sau khi cập nhật dữ liệu trong form chi tiết

  /**
   * Thực hiện hành xử sau khi cập nhật field form chi tiết
   * Chưa tối ưu, sẽ sửa trong thời gian tới
   * @param {GroupFieldConfig} e
   * @param {BaseControl} field
   * @memberof AmisControlGroupComponent
   */
  AfterUpdateFieldInFormView(e: GroupFieldConfig, field: BaseControl) {
    let lsitField = [];
    lsitField.push(e);
    this.listGroupFieldConfigClone = AmisCommonUtils.cloneDataArray(this.listGroupFieldConfig);
    let data = [];
    data.push(e.FieldName);
    data = this.valueChangedInFormView(e, data);
    if (this.listFieldChangeWaiting?.length) {
      let ind = this.listFieldChangeWaiting.findIndex(th => th.FieldName === e.FieldName);
      if (ind != -1) {
        let obj = this.listFieldChangeWaiting[ind];
        if (obj.ListFieldChange?.length) {
          obj.ListFieldChange.forEach(t => {
            let index = this.listGroupFieldConfigClone.findIndex(gf => gf.FieldName == t.FieldName);
            if (index != -1) {
              this.listGroupFieldConfigClone[index].Value = t.Value;
              this.listGroupFieldConfigClone[index].ValueText = t.ValueText;
              this.listGroupFieldConfigClone[index].IsReloadData = true;
              this.setDataAfterUpdateInFormView(data, t.FieldName);
              data = this.valueChangedInFormView(this.listGroupFieldConfigClone[index], data);
            }
          })
        }
        this.listFieldChangeWaiting.splice(ind, 1);
      }
    }
    if (data.length > 1) {
      lsitField.push(...this.listGroupFieldConfigClone.filter(gc => data.includes(gc.FieldName) && gc.FieldName !== e.FieldName));
    }
    let validateList = [];
    if (this.ConfigValidates?.length) {
      this.ConfigValidates.forEach(of => {
        let indexF = this.listGroupFieldConfigClone.findIndex(gf => gf.FieldName == of.FieldSource);
        let indexV = this.listGroupFieldConfigClone.findIndex(gf => gf.FieldName == of.FieldValidate);
        if (indexF != -1 && indexV != -1) {
          if (!checkDependentData(this.listGroupFieldConfigClone[indexF].Value, this.listGroupFieldConfigClone[indexF].DataType, of.Operator, this.listGroupFieldConfigClone[indexV].Value)) {
            if (this.listGroupFieldConfigClone[indexF].FieldName === e.FieldName || this.listGroupFieldConfigClone[indexV].FieldName === e.FieldName) {
              e.IsShowError = true;
              e.IsErrorCustom = true;
              e.ErrorMessage = this.generateErrorMessageCustom(this.listGroupFieldConfigClone[indexF].Caption, of.Operator, this.listGroupFieldConfigClone[indexV].Caption);
              field.focusInput();
            }
            validateList.push(this.listGroupFieldConfigClone[indexF]);
          }
        }
      })
    }
    if (validateList.length > 0) {
      return;
    }
    if (lsitField.length == 1) {
      this.updateFieldData(e, field);
    } else {
      this.updateMultiFieldData(e, lsitField, field);
    }
  }

  /**
   * Thực hiện thay đổi giá trị trên form view
   * @memberof AmisControlGroupComponent
   * created by vhtruong - 08/06/2020
   */
  valueChangedInFormView(e: GroupFieldConfig, dataS = []) {
    if (this.DependentClones?.length && this.listDataClone?.length) {
      this.changeFieldCloneInFormView(e, dataS);
    }
    if (this.DependentDatas?.length || this.DependentDictionaries?.length) {
      this.changeFieldDependancyInFormView(e, dataS);
    }
    if (this.listFieldInFormula?.length) {
      let data = this.listFieldInFormula.find(t => t.FieldName == e.FieldName)
      if (data) {
        const dataobject = this.listFieldFormula.find(m => m.FieldName === data.FieldFormula);
        this.setFormulaValueDetailInFormView(dataobject, dataS);
      }
    }

    // if (this._isSubmit) {
    //   this.validateOtherField(e?.Data);
    // }
    return dataS;
  }


  /**
   * Xử lý copy trong form view
   * @param {any} groupFieldConfig
   * @param {any} [dataS=[]]
   * @memberof AmisControlGroupComponent
   * created by vhtruong - 08/06/2020
   */
  changeFieldCloneInFormView(groupFieldConfig, dataS = []) {

    let indexParent = this.DependentClones?.findIndex(t => t.FieldName === groupFieldConfig.FieldName);

    if (indexParent !== -1) {
      let data = this.DependentClones[indexParent];
      if (checkDependentData(groupFieldConfig.Value, groupFieldConfig.DataType, data.Operator, data.Value)) {
        if (data?.ListFieldDependancy?.length) {
          data?.ListFieldDependancy.forEach(f => {
            let indexField1 = this.listGroupFieldConfigClone.findIndex(gf => gf.FieldName === f.FieldName1);
            let indexField2 = this.listGroupFieldConfigClone.findIndex(gf => gf.FieldName === f.FieldName2);
            this.listGroupFieldConfigClone[indexField2].Value = this.listGroupFieldConfigClone[indexField1].Value;
            this.listGroupFieldConfigClone[indexField2].ValueText = this.listGroupFieldConfigClone[indexField1].ValueText;
            this.listGroupFieldConfigClone[indexField2].IsReloadData = true;
            this.setDataAfterUpdateInFormView(dataS, this.listGroupFieldConfigClone[indexField2].FieldName);
            this.valueChangedInFormView(this.listGroupFieldConfigClone[indexField2], dataS);
          })
        }
      }
    }

    let indexCopy = this.listDataClone?.findIndex(dc => dc.FieldCopy === groupFieldConfig.FieldName);
    if (indexCopy !== -1) {

      let dataCloneCopy = this.listDataClone[indexCopy];
      let indexP = this.DependentClones?.findIndex(dp => dp.FieldName === dataCloneCopy.FieldParent);

      if (indexP !== -1) {
        let dataP = this.DependentClones[indexP];
        let groupConfigP = this.listGroupFieldConfigClone.find(gfc => gfc.FieldName === dataP.FieldName);
        if (checkDependentData(groupConfigP?.Value, groupConfigP?.DataType, dataP.Operator, dataP.Value)) {
          let indexField2 = this.listGroupFieldConfigClone.findIndex(gf => gf.FieldName === dataCloneCopy.FieldPaste);
          this.listGroupFieldConfigClone[indexField2].Value = groupFieldConfig.Value;
          this.listGroupFieldConfigClone[indexField2].ValueText = groupFieldConfig.ValueText;
          this.listGroupFieldConfigClone[indexField2].IsReloadData = true;
          this.setDataAfterUpdateInFormView(dataS, this.listGroupFieldConfigClone[indexField2].FieldName);
          this.valueChangedInFormView(this.listGroupFieldConfigClone[indexField2], dataS);
        }
      }
    }

    let indexPaste = this.listDataClone?.findIndex(dc => dc.FieldPaste === groupFieldConfig.FieldName);
    if (indexPaste !== -1) {

      let dataClonePaste = this.listDataClone[indexPaste];
      let groupConfigCopy = this.listGroupFieldConfigClone.find(gfc => gfc.FieldName === dataClonePaste.FieldCopy);

      if (groupFieldConfig.Value !== groupConfigCopy.Value) {
        let indexP = this.DependentClones?.findIndex(dp => dp.FieldName === dataClonePaste.FieldParent);

        if (indexP !== -1) {
          let dataP = this.DependentClones[indexP];
          let groupConfigP = this.listGroupFieldConfigClone.find(gfc => gfc.FieldName === dataP.FieldName);
          if (checkDependentData(groupConfigP?.Value, groupConfigP?.DataType, dataP.Operator, dataP.Value)) {
            groupConfigP.Value = !groupConfigP.Value;
            this.setDataAfterUpdateInFormView(dataS, groupConfigP.FieldName);
            this.valueChangedInFormView(groupConfigP, dataS);
          }
        }
      }
    }

  }


  /**
   * Xử lý trường dữ liệu liên quan trong form view
   * @param {any} groupFieldConfig
   * @param {any} [data=[]]
   * @memberof AmisControlGroupComponent
   */
  changeFieldDependancyInFormView(groupFieldConfig, data = []) {

    // Xử lý các value liên quan đến giá trị field khác( vd: chọn tỉnh huyện xã)
    let listFieldDepen = [];
    if (!groupFieldConfig.IsReadOnly) {
      listFieldDepen = this.DependentDictionaries.filter(d => d.DependentField == groupFieldConfig.FieldName);
    }

    // Các trường giá tri liên quan đến nhau
    const listDepenData = this.DependentDatas.filter(d => d.FieldName == groupFieldConfig.FieldName);
    const dependentDatas = [];
    if (listDepenData?.length) {
      listDepenData.forEach(d => {
        if (checkDependentData(groupFieldConfig?.Value, groupFieldConfig?.DataType, d.Operator, d.Value)) {
          if (d.Config) {
            try {
              const param = JSON.parse(d.Config);
              if (param?.length) {
                dependentDatas.push(...param);
              }
            }
            catch (ex) {
              console.log(ex);
            }
          }
        }
      })
    }

    if (listFieldDepen?.length) {
      this.changeFieldWithDependencyInFormView(listFieldDepen, data);
    }

    if (dependentDatas?.length) {
      this.changeFieldDependentDataInFormView(dependentDatas, data);
    }
  }


  /**
   * Xử lý dependent dictionary
   * @param {any} [listFieldDepen=[]]
   * @param {any} [dataS=[]]
   * @memberof AmisControlGroupComponent
   */
  changeFieldWithDependencyInFormView(listFieldDepen = [], dataS = []) {
    const data = this.listGroupFieldConfigClone.filter(t => listFieldDepen.findIndex(lf => lf.FieldName === t.FieldName) !== -1);
    data?.forEach(gf => {
      if (listFieldDepen.findIndex(lf => lf.FieldName === gf.FieldName) !== -1) {
        gf.Value = null;
        gf.ValueText = null;
        gf.IsReloadData = true;
        this.setDataAfterUpdateInFormView(dataS, gf.FieldName);
        this.valueChangedInFormView(gf, dataS);
      }
    })

  }


  /**
   * Xử lý dependent data
   * @param {any} [dependentDatas=[]]
   * @param {any} [dataS=[]]
   * @memberof AmisControlGroupComponent
   */
  changeFieldDependentDataInFormView(dependentDatas = [], dataS = []) {
    const data = this.listGroupFieldConfigClone.filter(t => dependentDatas.findIndex(lf => lf.FieldName === t.FieldName) !== -1);
    data?.forEach(gf => {
      dependentDatas.forEach(dd => {
        if (dd.FieldName == gf.FieldName) {
          for (let item in dd) {
            if (item !== "FieldName") {
              gf[item] = dd[item];
            }
          }
          gf.ValidateMethod = GroupConfigUtils.GenerateValidateMethod(gf);
          this.setDataAfterUpdateInFormView(dataS, gf.FieldName);
          if (dd.hasOwnProperty("Value") || dd.hasOwnProperty("ValueText")) {
            this.valueChangedInFormView(gf, dataS);
          }
        }
      })
    })

  }


  /**
   * Xử lý trường công thức form view
   * @param {any} e
   * @param {any} [dataS=[]]
   * @memberof AmisControlGroupComponent
   */
  setFormulaValueDetailInFormView(e, dataS = []) {
    let index = this.listGroupFieldConfigClone.findIndex(gf => gf.FieldName == e.FieldName);
    if (index != -1) {
      const normalizeParamsObj = this.setNormalizeParams(
        e.ListFieldInFormula,
        e.Content,
        this.listGroupFieldConfigClone
      );
      const normalizeParams = normalizeParamsObj.normalizeParams;
      this.listGroupFieldConfigClone[index].Value = executeFormula(normalizeParamsObj.text, normalizeParams);
      this.setDataAfterUpdateInFormView(dataS, this.listGroupFieldConfigClone[index].FieldName);
      this.valueChangedInFormView(this.listGroupFieldConfigClone[index], dataS);
    }
  }


  /**
   * Set danh sách
   * @param {any} [data=[]]
   * @param {any} fieldName
   * @memberof AmisControlGroupComponent
   */
  setDataAfterUpdateInFormView(data = [], fieldName) {
    if (data.findIndex(d => d == fieldName) === -1) {
      data.push(fieldName);
    }
  }

  //#endregion

  //#region  Xử lý sự kiện khi validate

  /**
   * Có lỗi bắn ra sau khi xử lý validate info
   */
  onError(e) {
    this.actionAfterSubmit({
      IsError: true
    });
  }

  /**
  * click không trên popup confirm
  * nmduy 22/06/2020
  */
  onClickNo(e) {
    if (this.isCustomHanldeValidateInfos) {
      this.onClickNoEvent.emit({
        ValidateInfos: this.validateInfos,
        GroupConfigs: this.listGroupbox,
        CurrentField: this.currentField
      });
    } else {
      this.onClickNoEvent.emit(this.listGroupbox);
    }

  }


  /**
   * click có trên popup confirm
   * nmduy 22/06/2020
   */
  onClickYes(e) {
    if (this._formMode == FormMode.View && this.currentItem && this.currentField) {
      if (this.validateInfos?.length && !this.isCustomHanldeValidateInfos) {
        const item = this.validateInfos.find(i => i.AdditionInfo.FieldName == this.currentItem.FieldName);
        if (item) {
          this.currentItem.PassWarningCode = [];
          this.currentItem.PassWarningCode.push(item.Code);
        }
        this.updateFieldData(this.currentItem, this.currentField);
      } else {
        this.onClickYesEvent.emit({
          ValidateInfos: this.validateInfos,
          GroupConfigs: this.listGroupbox,
          CurrentField: this.currentField
        });
      }
    } else {
      if (e) {
        this.onClickYesEvent.emit(this.listGroupbox);
      }
    }
  }

  //#endregion


  /**
   * Thay đổi cách xem dữ liệu
   * @param {any} data 
   * @memberof AmisControlGroupComponent
   * created by vhtruong - 20/07/2020
   */
  changeView(data) {
    if (data.ExpendID) {
      let ind = this.listGroupbox.findIndex(g => g.GroupConfigID == data.ExpendID);
      if (ind != -1) {
        if (!this.listGroupbox[ind].IsShowExpand && !this.listGroupbox[ind].IsExpand) {
          this.changeShowExpand(this.listGroupbox[ind]);
        }
      }
    }
  }


  /**
   * Nhận sự kiện thay đổi dữ liệu grid
   * @param {any} e 
   * @memberof AmisControlGroupComponent
   * created by vhtruong - 21/07/2020
   */
  afterChangedDataGrid(e) {
    this.afterChangeDataGrid.emit(e);
    if (e.GroupConfig) {
      if (e.GroupConfig.CustomConfigObject) {
        let customConfig = e.GroupConfig.CustomConfigObject;
        if (customConfig.hasOwnProperty('ListFieldChangedIfHaveData')) {
          if (e.Data?.length && e.IsChangeDataLength) {
            const data = this.listGroupFieldConfig.filter(t => customConfig.ListFieldChangedIfHaveData.findIndex(lf => lf.FieldName === t.FieldName) !== -1);
            data?.forEach(gf => {
              customConfig.ListFieldChangedIfHaveData.forEach(dd => {
                if (dd.FieldName == gf.FieldName) {
                  for (let item in dd) {
                    if (item !== "FieldName") {
                      gf[item] = dd[item];
                    }
                  }
                }
              })
            })
          }
        }
        if (customConfig.hasOwnProperty('ListFieldChangedIfNoData')) {
          if (!e.Data?.length && e.IsChangeDataLength) {
            const data = this.listGroupFieldConfig.filter(t => customConfig.ListFieldChangedIfNoData.findIndex(lf => lf.FieldName === t.FieldName) !== -1);
            data?.forEach(gf => {
              customConfig.ListFieldChangedIfNoData.forEach(dd => {
                if (dd.FieldName == gf.FieldName) {
                  for (let item in dd) {
                    if (item !== "FieldName") {
                      gf[item] = dd[item];
                    }
                  }
                }
              })
            })
          }
        }
      }
    }
  }


  /**
   * Lấy dữ liệu theo groupID
   * @param {any} groupbox 
   * @memberof AmisControlGroupComponent
   * created by vhtruong - 28/07/2020
   */
  getDataByGroupID(groupbox) {

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
   * xử lý tab giữa các group row
   * @param {any} e
   * created by dtnam1 - 30/07/2020
   */
  handleTabGroupRow(e) {
    let groupRow: any = this.groupRow;
    let groupRowIndex = groupRow._results.findIndex(x => x.groupbox.GroupConfigID === e.GroupConfigID);

    //tìm index cho group row
    do {
      if (e.IsTab) {
        groupRowIndex++;
      }
      else {
        groupRowIndex--;
      }
      var rowEle = groupRow._results[groupRowIndex];
      if (!rowEle) {
        //chặn event tab ban đầu
        e.Event?.preventDefault();
        return;
      }
      var childIndex = groupRow._results.findIndex(x => x.groupbox.GroupConfigID === rowEle.groupbox.GroupConfigID);
    }
    while (groupRowIndex >= 0
    && groupRowIndex <= groupRow._results.length
      && (!rowEle.field?.length || childIndex < groupRowIndex));

    //group row tiếp theo được focus
    let nextGroupRow = groupRow._results[groupRowIndex];

    if (nextGroupRow) {
      let colOne = nextGroupRow.groupbox.ColOne;
      let colTwo = nextGroupRow.groupbox.ColTwo;
      let focusField;
      if (colOne?.length && colTwo?.length) {
        //nếu là tab xuôi chiều thì focus vào trường đầu tiên bên trái
        if (e.IsTab) {
          focusField = colOne[0];
        }
        //nếu là tab ngc chiều thì focus vào trường cuối cùng của cột dài nhất
        else {
          let lastFieldColOne = colOne[colOne.length - 1];
          let lastFieldColTwo = colTwo[colTwo.length - 1];
          focusField = lastFieldColOne;
          if (lastFieldColTwo.RowIndex >= lastFieldColOne.RowIndex) {
            focusField = lastFieldColTwo;
          }
        }

        focusField = AmisCommonUtils.cloneData(focusField);
        nextGroupRow.handleTabForm({
          IsTab: e.IsTab,
          RowIndex: focusField.RowIndex,
          ColumnIndex: focusField.ColumnIndex,
          FieldName: focusField.FieldName,
          Event: e.Event
        }, true);
      }
    }
  }


  /**
   * Hiển thị tooltip
   * @param {any} e 
   * @memberof AmisControlGroupComponent
   */
  showTooltip(event, content) {
    this.targerTooltip = event.target;
    this.isShowTooltip = true;
    this.tooltipContent = content;
  }

  /**
   * Ẩn tooltip
   * @param {any} e 
   * @memberof AmisControlGroupComponent
   */
  hideTooltip(e) {
    this.isShowTooltip = false;
  }

}
