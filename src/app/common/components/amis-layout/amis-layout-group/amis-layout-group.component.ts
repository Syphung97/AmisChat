import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { GroupConfigUtils } from 'src/app/shared/function/group-control-utils';
import { FormMode } from 'src/common/enum/form-mode.enum';
import { LayoutConfig } from 'src/app/shared/models/layout-config/layout-config';
import { TypeShowControl } from 'src/common/models/base/typeShow';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { AmisDataService } from 'src/common/services/amis-data.service';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { BaseHRMModel } from 'src/app/shared/models/base-hrm';
import { GroupConfig } from 'src/app/shared/models/group-config/group-config';
import { BaseComponent } from '../../base-component';
import { GroupType } from 'src/app/shared/enum/group-config/group-type.enum';
import { SaveDataType } from 'src/common/enum/action-save.enum';

@Component({
  selector: 'amis-amis-layout-group',
  templateUrl: './amis-layout-group.component.html',
  styleUrls: ['./amis-layout-group.component.scss']
})
export class AmisLayoutGroupComponent extends BaseComponent implements OnInit {

  // Sau khi validate form
  @Output() afterValidatedForm: EventEmitter<any> = new EventEmitter();

  // Sau khi có một trường thay đổi
  @Output() valueFieldChanged: EventEmitter<any> = new EventEmitter();

  // Sau khi gọi api lưu thành công
  @Output() afterSaveSuccess: EventEmitter<any> = new EventEmitter();

  // Sau khi hủy bỏ
  @Output() afterCancel: EventEmitter<any> = new EventEmitter();

  // click đồng ý sau khi validate infos trả về
  @Output() onClickYesEvent: EventEmitter<any> = new EventEmitter();

  // output click không trên popup confirm
  @Output() onClickNoEvent: EventEmitter<any> = new EventEmitter();


  // là popup confirm hay option
  @Input() isConfirmNotify: boolean = false;

  // Key thông báo khi lưu dữ liệu thành công
  @Input() KeyToastSuccess: string = "";

  // Key thông báo khi lưu dữ liệu thất bại
  @Input() KeyToastError: string = "";

  // Key thông báo khi lưu dữ liệu thất bại
  @Input() isCustomSaveAfterValidate: boolean = false;

  // có hiển thị nút sửa không
  isHideEditBtn: boolean = false;

  // ID của object trường hợp form sửa
  objectID: any;

  // Hiển thị header hay không
  isDisplayHeader: boolean = false;

  validateInfos = [];

  // Kiểu lưu dữ liệu
  actionSaveData: SaveDataType;

  // Có check quyền hay không
  isIgnorePermission: boolean = false;

  // System code cần check quyền
  permissionSystemCode: string;

  // Gọi từ nhân viên
  isCallFromEmployeeApp: boolean = false;

  // Object param
  @Input() set inputParam(data) {
    if (data) {
      this.isHideEditBtn = data?.IsViewOnly ? true : false;
      if (data.ObjectData) {
        this.objectDefault = AmisCommonUtils.cloneData(data.ObjectData);
        this.objectData = data.ObjectData;
        this.listGroupConfigs = AmisCommonUtils.cloneDataArray(data.ObjectData.GroupConfigs);
        this.objectDefault = AmisCommonUtils.cloneData(this.objectData);
        this.objectDefault.GroupConfigs = AmisCommonUtils.cloneDataArray(this.listGroupConfigs);
        this.objectDefault.GroupConfigs?.forEach(e => {
          let index = this.listGroupConfigs.findIndex(t => t == e);
          if (index != -1) {
            e.GroupFieldConfigs = AmisCommonUtils.cloneDataArray(this.listGroupConfigs[index].GroupFieldConfigs);
            e.ColOne = AmisCommonUtils.cloneDataArray(this.listGroupConfigs[index].ColOne);
            e.ColTwo = AmisCommonUtils.cloneDataArray(this.listGroupConfigs[index].ColTwo);
          }
        });
      }
      this.listDependentData = data.DependentDatas;
      this.listDependentDictionaries = data.DependentDictionaries;
      this.listDependentClones = data.DependentClones;
      this.listConfigValidates = data.ConfigValidates;
      this.isCallAPIInit = data.IsCallAPIInit;
      this.isCallAPISave = data.IsCallAPISave;
      this.isDisplayHeader = data.IsDisplayHeader;
      this.groupConfig = data.GroupConfig;
      this.masterIDValue = data.MasterIDValue;
      this.masterIDField = data.MasterIDField;
      this.objectID = data.ObjectID;
      this._formMode = data.FormMode;
      this.listDataCloneAndChangeField = data.DataCloneAndChangeField;
      this.isIgnorePermission = data.CallFromEmployeeApp ? true : data.IsIgnorePermission;
      this.isCallFromEmployeeApp = data.CallFromEmployeeApp ? true : false;
      this._permissionCode = data.PermissionCode;
      this.permissionSystemCode = data.PermissionSystemCode;
      this.initForm();
    }
  };

  /**
   * Show loading
   * @type {boolean}
   * @memberof AmisLayoutGroupComponent
   */
  _isShowLoading: boolean = false;
  @Input() get isShowLoading() {
    return this._isShowLoading;
  }
  set isShowLoading(val) {
    this._isShowLoading = val;
    if (this._isShowLoading) {
      this.isLoading = true;
    }
  }

  /**
   * Controller sử dụng để lưu dữ liệu
   * @memberof AmisLayoutGroupComponent
   */
  _controller: string = "";
  @Input() get controller() {
    return this._controller;
  }
  set controller(val) {
    this._controller = val;
  }

  /**
   * subSystemCode
   * @memberof AmisLayoutGroupComponent
   */
  _subSystemCode: string = "";
  @Input() get subSystemCode() {
    return this._subSystemCode;
  }
  set subSystemCode(val) {
    this._subSystemCode = val;
  }

  _permissionCode: string = "";

  /**
   * layoutConfidID
   * @memberof AmisLayoutGroupComponent
   */
  _layoutConfidID;
  @Input() get layoutConfidID() {
    return this._layoutConfidID;
  }
  set layoutConfidID(val) {
    this._layoutConfidID = val;
  }

  /**
   * Hiển thị button trên grid
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
   */
  _isShowNodataGrid: boolean = true;
  @Input() get isShowNodataGrid() {
    return this._isShowNodataGrid;
  }
  set isShowNodataGrid(val) {
    this._isShowNodataGrid = val;
  }

  /**
   * FormMode
   */
  _formMode: FormMode;

  // Loading
  isLoading: boolean = false;

  // Có gọi API save hay không
  isCallAPISave: boolean = true;

  // Có gọi API lúc init form
  isCallAPIInit: boolean = false;

  // Object default
  objectDefault: BaseHRMModel;

  // Danh sách các group config
  listGroupConfigs: GroupConfig[] = [];

  // Danh sách các trường phụ thuộc vào giá trị
  listDependentData = [];

  // Danh sách các trường phụ thuộc cha con
  listDependentDictionaries = [];

  // Danh sách các trường copy
  listDependentClones = [];

  // Danh sách các trường dữ liệu truyền lên từ master
  listDataCloneAndChangeField = [];

  // Config validate các trường với nhau
  listConfigValidates = [];

  // Object truyền vào khi ấn submit
  submitObject: any;

  // Object truyền vào sau khi submit
  objectAfterSubmit;

  // Form mode của loại lưu
  formModeSaveData: FormMode;

  // Hiển thị popup thông báo
  visiblePopupNotify: boolean = false;

  // Dữ liệu đã bị thay đổi hay chưa
  isChangedData: boolean = false;

  // Object layout config
  layoutConfig: LayoutConfig;

  // Không có dữ liệu
  isNoData: boolean = true;

  // Object
  objectData: BaseHRMModel = new BaseHRMModel();

  // GroupConfig cha
  groupConfig: GroupConfig;

  // ID cha
  masterIDValue: any;

  // field khóa ngoại
  masterIDField: any;

  // Nội dung popup notify
  popupNotifyContent;

  // config để hiển thị form
  typeShowControl: TypeShowControl = {
    IsEditable: false,
    IsViewOnly: false,
    IsViewEditable: false
  };

  constructor(
    private amisTransferSV: AmisTransferDataService,
    public amisDataService: AmisDataService,
    private amisTranslateSV: AmisTranslationService
  ) {
    super();
  }

  ngOnInit(): void {
  }

  //#region Init form

  /**
   * Bắt đầu vào form
   * @memberof AmisLayoutGroupComponent
   * created by vhtruong 15/06/2020
   */
  initForm() {
    switch (this._formMode) {
      case FormMode.Insert:
        this.initFormInsert();
        break;
      case FormMode.Update:
        this.initFormEdit();
        break;
      case FormMode.View:
        this.initFormView();
        break;
    }
  }

  /**
   * 
   * @memberof AmisLayoutGroupComponent
   * created by vhtruong - 15/06/2020
   */
  initFormInsert() {
    this.typeShowControl = {
      IsEditable: false,
      IsViewOnly: false,
      IsViewEditable: false
    };
    if (this.isCallAPIInit) {
      this.amisDataService.getDataDefaultBinding(this._controller, this._subSystemCode, this._layoutConfidID ?? 0).subscribe(res => {
        if (res?.Success && res.Data) {
          if (this.listDataCloneAndChangeField?.length) {
            res.Data.GroupConfigs.forEach(t => {
              this.setDataBeforeShow(t);
              t.ListGroupConfigChild?.forEach(tc => {
                this.setDataBeforeShow(tc);
              })
            })
          }
          this.listGroupConfigs = AmisCommonUtils.cloneDataArray(GroupConfigUtils.GetData(res.Data.GroupConfigs))
          this.objectData = AmisCommonUtils.cloneData(res.Data);
          this.objectData["DependentDatas"] = null;
          this.objectData["DependentDictionaries"] = null;
          this.objectData["ConfigValidates"] = null;
          this.objectData["GroupConfigs"] = this.listGroupConfigs;
          this.listDependentData = res.Data.DependentDatas;
          this.listDependentDictionaries = res.Data.DependentDictionaries;
          this.objectData.State = FormMode.Insert;
          this.isLoading = false;
          return;
        }
        this.isLoading = false;
      }, error => {
        this.isLoading = false;
      })
    } else {
      if (this.listDataCloneAndChangeField?.length) {
        this.listGroupConfigs.forEach(t => {
          this.setDataBeforeShow(t);
          t.ListGroupConfigChild?.forEach(tc => {
            this.setDataBeforeShow(tc);
          })
        })
      }
    }
  }

  /**
   * 
   * @memberof AmisLayoutGroupComponent
   * created by vhtruong - 15/06/2020
   */
  initFormEdit() {
    this.typeShowControl = {
      IsEditable: false,
      IsViewOnly: false,
      IsViewEditable: false
    };
    // this.isNoData = true;
    if (this.isCallAPIInit) {
      if (this.objectID) {
        const obj = {
          SubsystemCode: this._subSystemCode,
          LayoutConfigID: 0,
          MasterValue: this.objectID
        }
        this.amisDataService.getLauoutConfigAndData(obj).subscribe(res => {
          if (res?.Success && res.Data) {
            if (res.Data.MasterData) {
              this.layoutConfig = res.Data;
              if (this.listDataCloneAndChangeField?.length) {
                this.layoutConfig.ListGroupConfig.forEach(t => {
                  this.setDataBeforeShow(t);
                  t.ListGroupConfigChild?.forEach(tc => {
                    this.setDataBeforeShow(tc);
                  })
                })
              }
              this.objectData = this.layoutConfig.MasterData;
              this.objectData.State = FormMode.Update;
              this.objectData["GroupConfigs"] = this.layoutConfig.ListGroupConfig;
              this.listGroupConfigs = AmisCommonUtils.cloneDataArray(GroupConfigUtils.GetData(this.layoutConfig.ListGroupConfig));
              this.listDependentData = this.layoutConfig.DependentDatas;
              this.listDependentDictionaries = this.layoutConfig.DependentDictionaries;
              // this.isNoData = false;
            }
            this.isLoading = false;
            return;
          }
          // this.isNoData = true;
          this.isLoading = false;
        }, error => {
          // this.isNoData = true;
          this.isLoading = false;
        })
      }
    }
  }


  /**
   * 
   * @memberof AmisLayoutGroupComponent
   */
  initFormView() {
    this.typeShowControl = {
      IsEditable: false,
      IsViewOnly: true,
      IsViewEditable: false
    };
    // this.isNoData = true;
    if (this.isCallAPIInit) {

      if (this.objectID) {
        const obj = {
          SubsystemCode: this._subSystemCode,
          LayoutConfigID: 0,
          MasterValue: this.objectID
        }
        this.amisDataService.getLauoutConfigAndData(obj).subscribe(res => {
          if (res?.Success && res.Data) {
            if (res.Data.MasterData) {
              this.layoutConfig = res.Data;
              if (this.listDataCloneAndChangeField?.length) {
                this.layoutConfig.ListGroupConfig.forEach(t => {
                  this.setDataBeforeShow(t);
                  t.ListGroupConfigChild?.forEach(tc => {
                    this.setDataBeforeShow(tc);
                  })
                })
              }
              this.objectData = this.layoutConfig.MasterData;
              this.objectData.State = FormMode.Update;
              this.objectData["GroupConfigs"] = this.layoutConfig.ListGroupConfig;
              this.listGroupConfigs = AmisCommonUtils.cloneDataArray(GroupConfigUtils.GetData(this.layoutConfig.ListGroupConfig));
              this.listDependentData = this.layoutConfig.DependentDatas;
              this.listDependentDictionaries = this.layoutConfig.DependentDictionaries;
              // this.isNoData = false;
            }
            this.isLoading = false;
            return;
          }
          // this.isNoData = true;
          this.isLoading = false;
        }, error => {
          // this.isNoData = true;
          this.isLoading = false;
        })
      }
    }
  }


  /**
   * Gán giá trị trước khi mở form
   * @param {any} groupConfig 
   * @param {any} listDataCloneAndChangeField 
   * @memberof AmisLayoutGroupComponent
   */
  setDataBeforeShow(groupConfig) {
    groupConfig.GroupFieldConfigs?.forEach(gf => {
      let ind = this.listDataCloneAndChangeField.findIndex(dc => dc.FieldName == gf.FieldName);
      if (ind != -1) {
        if (this._formMode === FormMode.Insert) {
          gf.Value = this.listDataCloneAndChangeField[ind].Value;
          gf.ValueText = this.listDataCloneAndChangeField[ind].ValueText;
        }
        if (this.listDataCloneAndChangeField[ind].PropertyChange) {
          for (let item in this.listDataCloneAndChangeField[ind].PropertyChange) {
            gf[item] = this.listDataCloneAndChangeField[ind].PropertyChange[item];
          }
        }
      }
    })
  }

  //#endregion

  //#region Xử lý action liên quan

  /**
   * Hiển thị form sửa
   * @memberof AmisLayoutGroupComponent
   */
  onClickEditInFormGrid() {
    this._formMode = FormMode.Update;
    this.typeShowControl = AmisCommonUtils.cloneData({
      IsEditable: false,
      IsViewOnly: false,
      IsViewEditable: false
    });
    this.objectAfterSubmit = AmisCommonUtils.cloneData({
      IsFocusFirstItem: true
    });
  }

  /**
   * Sau khi validate 
   * @param {any} e 
   * @memberof AmisLayoutGroupComponent
   * created by vhtruong - 15/06/2020
   */
  afterValidated(e) {
    this.afterValidatedForm.emit(e);
    if (e?.length) {
      return;
    }
    switch (this._formMode) {
      case FormMode.Insert:
        this.saveDataInsert();
        break;
      case FormMode.Update:
        this.saveDataEdit();
        break;
    }
  }


  /**
   * 
   * @memberof AmisLayoutGroupComponent
   */
  cancel() {
    if (this.isChangedData) {
      this.popupNotifyContent = this.amisTranslateSV.getValueByKey("CANCEL_RECENT_TYPE_CONTENT");
      this.showPopupNotify();
    }
    else {
      this.confirmCancel();
    }
  }


  /**
   * 
   * @param {any} formMode 
   * @memberof AmisLayoutGroupComponent
   */
  submit(formMode?, actionSave?) {
    this.formModeSaveData = formMode;
    this.actionSaveData = actionSave;
    this.submitObject = AmisCommonUtils.cloneData({
      IsSubmit: true
    })
  }

  //#endregion

  //#region Lưu dữ liệu

  /**
   * Lưu dữ liệu thêm mới
   * @memberof AmisLayoutGroupComponent
   * created by vhtruong - 15/06/2020
   */
  saveDataInsert() {

    // Gọi API để lưu luôn
    if (this.isCallAPISave) {

      this.amisTransferSV.showLoading("", "amis-f-layout");

      let param = AmisCommonUtils.cloneData(this.objectData);
      if (this.masterIDField) {
        param[this.masterIDField] = this.masterIDValue;
      }
      param.State = FormMode.Insert;
      param.GroupConfigs = AmisCommonUtils.cloneDataArray(this.objectData.GroupConfigs);
      param.GroupConfigs.forEach(p => {
        p.ListGroupConfigChild = [];
        p.ColOne = [];
        p.ColTwo = [];
      })
      this.amisDataService.save(this._controller, param).subscribe(res => {
        this.amisTransferSV.hideLoading();
        if (res?.Success) {
          if (res.Data) {
            if (this.formModeSaveData === FormMode.Insert) {

              this.amisTransferSV.showSuccessToast(this.amisTranslateSV.getValueByKey(this.KeyToastSuccess ? this.KeyToastSuccess : "ADD_SUCCESS"));
              this.afterSaveSuccess.emit({
                FormModeSaveData: this.formModeSaveData,
                FormMode: FormMode.Insert,
                Data: res.Data,
                GroupConfig: this.groupConfig
              });

            }
            else if (this.formModeSaveData === FormMode.SaveAndInsert) {

              this.amisTransferSV.showSuccessToast(this.amisTranslateSV.getValueByKey(this.KeyToastSuccess ? this.KeyToastSuccess : "ADD_SUCCESS"));
              this.submitObject = AmisCommonUtils.cloneData({ IsSubmit: false });
              this.objectAfterSubmit = AmisCommonUtils.cloneData({ IsFocusFirstItem: true });
              this.isChangedData = false;
              if (this.isCallAPIInit) {
                this.initFormInsert();
              } else {
                this.objectData = AmisCommonUtils.cloneData(this.objectDefault);
                this.objectData.GroupConfigs = AmisCommonUtils.cloneData(this.objectDefault.GroupConfigs);
                this.listGroupConfigs = this.objectData.GroupConfigs;
                this.listGroupConfigs.forEach(e => {
                  e.GroupFieldConfigs?.forEach(gf => {
                    gf.Value = null;
                    gf.ValueText = null;
                  })
                  if (e.GroupType == GroupType.Grid) {
                    e.DataGroupConfig = [];
                  }
                })
              }
              this.afterSaveSuccess.emit({
                FormModeSaveData: this.formModeSaveData,
                FormMode: FormMode.Insert,
                Data: res.Data,
                GroupConfig: this.groupConfig
              });

            }
            return;
          }
        }
        else {

          if (res?.ValidateInfo?.length) {
            this.validateInfos = res.ValidateInfo;
            return;
          }

        }
        this.amisTransferSV.showErrorToast(this.amisTranslateSV.getValueByKey(this.KeyToastError ? this.KeyToastError : "ERROR_HAPPENED"));
      }, error => {
        this.amisTransferSV.showErrorToast(this.amisTranslateSV.getValueByKey("ERROR_HAPPENED"));
        this.amisTransferSV.hideLoading();
      })
    }
    // Trả về component cha để xử lý
    else {

      this.submitObject = AmisCommonUtils.cloneData({
        IsSubmit: false
      })

      // Ấn Lưu
      if (this.formModeSaveData === FormMode.Insert) {
        this.afterSaveSuccess.emit({
          FormModeSaveData: this.formModeSaveData,
          FormMode: FormMode.Insert,
          Data: this.objectData,
          GroupConfig: this.groupConfig
        });
      }

      // Ấn Lưu và thêm
      else if (this.formModeSaveData === FormMode.SaveAndInsert) {

        this.afterSaveSuccess.emit({
          FormModeSaveData: this.formModeSaveData,
          FormMode: FormMode.Insert,
          Data: this.objectData,
          GroupConfig: this.groupConfig
        });

        this.isChangedData = false;
        this.objectData = AmisCommonUtils.cloneData(this.objectDefault);
        this.objectData.GroupConfigs = AmisCommonUtils.cloneData(this.objectDefault.GroupConfigs);
        this.listGroupConfigs = this.objectData.GroupConfigs;
        this.listGroupConfigs.forEach(e => {
          e.GroupFieldConfigs?.forEach(gf => {
            gf.Value = null;
            gf.ValueText = null;
          })
          if (e.GroupType == GroupType.Grid) {
            e.DataGroupConfig = [];
          }
        })
      }
    }
  }


  /**
   * Lưu dữ liệu sửa
   * @memberof AmisLayoutGroupComponent
   * created by vhtruong - 15/06/2020
   */
  saveDataEdit() {
    // Gọi API để lưu luôn
    if (this.isCallAPISave) {
      this.amisTransferSV.showLoading("", "amis-f-layout");
      let param = AmisCommonUtils.cloneData(this.objectData);
      param.State = FormMode.Update;
      param.GroupConfigs = AmisCommonUtils.cloneDataArray(this.objectData.GroupConfigs);
      param.GroupConfigs.forEach(p => {
        let FieldID = p.FieldID;
        let ID = this.objectData[`${FieldID}`];
        p.ListGroupConfigChild = [];
        p.ColOne = [];
        p.ColTwo = [];
        p.GroupFieldConfigs.forEach(item => {
          item.ID = ID;
        });
      })
      this.amisDataService.save(this._controller, param).subscribe(res => {
        this.amisTransferSV.hideLoading();
        if (res?.Success) {

          this.amisTransferSV.showSuccessToast(this.amisTranslateSV.getValueByKey(this.KeyToastSuccess ? this.KeyToastSuccess : "EDIT_SUCCESS"));
          this.afterSaveSuccess.emit({
            FormModeSaveData: FormMode.Update,
            FormMode: FormMode.Update,
            Data: res.Data,
            GroupConfig: this.groupConfig
          });

          return;
        }
        else {
          if (res?.ValidateInfo?.length) {
            this.validateInfos = res.ValidateInfo;
            return;
          }
        }
        this.amisTransferSV.showErrorToast(this.amisTranslateSV.getValueByKey(this.KeyToastError ? this.KeyToastError : "ERROR_HAPPENED"));
      }, error => {
        this.amisTransferSV.showErrorToast(this.amisTranslateSV.getValueByKey("ERROR_HAPPENED"));
        this.amisTransferSV.hideLoading();
      })
    }

    // Nếu không gọi api
    else {
      this.afterSaveSuccess.emit({
        FormModeSaveData: FormMode.Update,
        FormMode: FormMode.Update,
        Data: this.objectData,
        GroupConfig: this.groupConfig
      });
    }
  }

  //#endregion

  //#region Popup confirm cancel


  /**
   * Đóng popup cancel
   * @memberof AmisLayoutGroupComponent
   * created by vhtruong - 15/06/2020
   */
  closePopupNotify() {
    this.visiblePopupNotify = false;
  }

  /**
   * Đồng ý hủy bỏ
   * @memberof AmisLayoutGroupComponent
   * created by vhtruong - 12/06/2020
   */
  confirmCancel() {
    this.closePopupNotify();
    this.afterCancel.emit();
  }


  /**
   * Hiển thị popup thông báo
   * @memberof AmisLayoutGroupComponent
   */
  showPopupNotify() {
    this.visiblePopupNotify = true;
  }

  //#endregion

  //#region Sự kiện nhận từ form

  /**
   * Một giá trị field thay đổi
   * @param {any} e 
   * @memberof AmisLayoutGroupComponent
   * created by vhtruong - 15/06/2020
   */
  changedFieldValue(e) {
    this.isChangedData = true;
  }

  //#endregion


  //#region  Xử lý sự kiện khi validate

  /**
  * click không trên popup confirm
  * nmduy 22/06/2020
  */
  onClickNo(e) {
    if (this.isCustomSaveAfterValidate) {
      let param = {
        ValidateInfo: this.validateInfos,
        ObjectData: this.objectData
      }
      this.onClickNoEvent.emit(param);
    }
  }


  /**
   * click có trên popup confirm
   * nmduy 22/06/2020
   */
  onClickYes(e) {
    if (e) {
      this.objectData.GroupConfigs = e;
      if (this.isCustomSaveAfterValidate) { // nếu là tủy chỉnh lại hàm save thì bắn tham số lưu ra ngoài
        let param = {
          ValidateInfo: this.validateInfos,
          ObjectData: this.objectData
        }
        this.onClickYesEvent.emit(param);
      } else {
        if (this._formMode == FormMode.Insert || this._formMode == FormMode.Duplicate) {
          this.saveDataInsert();
        } else if (this._formMode == FormMode.Update) {
          this.saveDataEdit();
        }
      }
    }
  }

}
