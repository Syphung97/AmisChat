import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { BaseComponent } from '../base-component';
import { FormMode } from 'src/common/enum/form-mode.enum';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { AmisDataService } from 'src/common/services/amis-data.service';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { GroupConfigUtils } from 'src/app/shared/function/group-control-utils';
import { GroupConfig } from 'src/app/shared/models/group-config/group-config';
import { TypeShowControl } from 'src/common/models/base/typeShow';
import { ActivatedRoute } from '@angular/router';
import { BaseHRMModel } from 'src/app/shared/models/base-hrm';
import { LayoutConfig } from 'src/app/shared/models/layout-config/layout-config';
import { AmisControlFormGroupComponent } from '../amis-control-form-group/amis-control-form-group.component';
import { SaveDataType } from 'src/common/enum/action-save.enum';
import { EmployeeMySelfService } from 'src/app/services/employee-myself/employee-myself.service';
import { GroupType } from 'src/app/shared/enum/group-config/group-type.enum';
import { TypeControl } from 'src/app/shared/enum/common/type-control.enum';

@Component({
  selector: 'amis-amis-layout',
  templateUrl: './amis-layout.component.html',
  styleUrls: ['./amis-layout.component.scss']
})
export class AmisLayoutComponent extends BaseComponent implements OnInit {

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

  // Có sử dụng master data đẻ binding dữ liệu hay không
  @Input() isUseMasterData: boolean = false;

  // Key thông báo khi lưu dữ liệu thành công
  @Input() KeyToastSuccess: string = "";

  // Key thông báo khi lưu dữ liệu thất bại
  @Input() KeyToastError: string = "";

  // Key thông báo khi lưu dữ liệu thất bại
  @Input() isCustomSaveAfterValidate: boolean = false;

  @Input() isTypeInFormGrid: boolean = false;

  @Input() fnsChangedDataGrid: Function;

  @Input() inputAfterChangedDataGrid: any;

  @Input() objectType: BaseHRMModel;

  @Output() focusOutField: EventEmitter<any> = new EventEmitter();



  /**
   * Show loading
   * @type {boolean}
   * @memberof AmisLayoutComponent
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
   * @memberof AmisLayoutComponent
   */
  _controller: string = "";
  @Input() get controller() {
    return this._controller;
  }
  set controller(val) {
    this._controller = val;
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
  _permissionSystemCode: string = ""
  @Input() get permissionSystemCode() {
    return this._permissionSystemCode;
  }
  set permissionSystemCode(val) {
    if (val) {
      this._permissionSystemCode = val
    }
  }

  /**
   * Quyền muốn check trong phân hệ
   * @type {string}
   * @memberof AmisControlFormGroupComponent
   */
  _permissionCode: string = ""
  @Input() get permission() {
    return this._permissionCode;
  }
  set permission(val) {
    if (val) {
      this._permissionCode = val
    }
  }

  /**
   * layoutConfidID
   * @memberof AmisLayoutComponent
   */
  _layoutConfidID;
  @Input() get layoutConfidID() {
    return this._layoutConfidID;
  }
  set layoutConfidID(val) {
    this._layoutConfidID = val;
  }

  /**
   * FormMode
   */
  _formMode: FormMode;
  @Input() get formMode() {
    return this._formMode;
  }
  set formMode(val) {
    this._formMode = val;
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

  //
  @ViewChild("formgroup") formgroup: AmisControlFormGroupComponent;

  // Loading
  isLoading: boolean = false;

  // ID của object trường hợp form sửa
  objectID: any;

  // Object
  objectData: BaseHRMModel;

  // Object default
  objectDefault: BaseHRMModel;

  // Danh sách các group config
  listGroupConfigs: GroupConfig[] = [];

  // Danh sách các trường phụ thuộc vào giá trị
  listDependentData = [];

  // Danh sách các trường phụ thuộc cha con
  listDependentDictionaries = [];

  listConfigValidates = [];

  isViewOnly: boolean = false;

  callFromEmployeeApp: boolean = false;

  employeeID: number = 0;

  // Danh sách các trường copy
  listDependentClones = [{
    FieldName: "SameNativeAddress",
    Operator: 1,
    Value: "True",
    ListFieldDependancy: [{
      FieldName1: "NativeCountryID",
      FieldName2: "CurrentCountryID"
    }, {
      FieldName1: "NativeProvinceID",
      FieldName2: "CurrentProvinceID"
    }, {
      FieldName1: "NativeDistrictID",
      FieldName2: "CurrentDistrictID"
    }, {
      FieldName1: "NativeWardID",
      FieldName2: "CurrentWardID"
    }, {
      FieldName1: "NativeStreetHouseNumber",
      FieldName2: "CurrentStreetHouseNumber"
    }]
  }];

  // Có hiển thị button Lưu và thêm mới hay không
  isShowBtnSaveAndInsert: boolean = true;

  @Input() set inputData(data) {
    if (data) {
      if (data.IsViewOnly) {
        this.isViewOnly = data.IsViewOnly;
        this.typeShowControl = {
          IsEditable: false,
          IsViewOnly: true,
          IsViewEditable: false
        };
      }
      this.employeeID = data?.ObjectData?.EmployeeID;
      this.callFromEmployeeApp = data?.CallFromEmployeeApp ? true : false;
      this.groupConfig = data.GroupConfig;
      this.masterIDValue = data.MasterIDValue;
      this.masterIDField = data.MasterIDField;
      this.objectID = data.ObjectID;
      if (this.isUseMasterData || data.IsUseMasterData) {
        this.objectData = data.MasterData;
      }
      if (!data.IsShowBtnSaveAndInsert) {
        this.isShowBtnSaveAndInsert = false;
      }
      this.listDataCloneAndChangeField = data.DataCloneAndChangeField;
      this.initForm();
    }
  }

  //tham số truyền vào để gen form sinh phụ lục cho hợp đồng từ grid
  @Input() set inputParam(data) {
    if (data) {
      this.masterIDValue = data.MasterIDValue;
      this.masterIDField = data.MasterIDField;
    }
  }

  masterIDValue: any;

  masterIDField: string;

  listDataCloneAndChangeField = [];

  // Object truyền vào khi ấn submit
  submitObject: any;

  // Object truyền vào sau khi submit
  objectAfterSubmit;

  // Form mode của loại lưu
  formModeSaveData: FormMode;

  // Kiểu lưu dữ liệu
  actionSaveData: SaveDataType;

  // Hiển thị popup thông báo
  visiblePopupNotify: boolean = false;

  // Hiển thị popup thông báo
  popupNotifyContent: string = "";

  // Dữ liệu đã bị thay đổi hay chưa
  isChangedData: boolean = false;

  // Object layout config
  layoutConfig: LayoutConfig;

  // Không có dữ liệu
  isNoData: boolean = true;

  groupConfig: GroupConfig;

  // config để hiển thị form
  typeShowControl: TypeShowControl = {
    IsEditable: false,
    IsViewOnly: false,
    IsViewEditable: false
  };

  validateInfos = [];

  constructor(
    private amisTransferSV: AmisTransferDataService,
    public amisDataService: AmisDataService,
    private amisTranslateSV: AmisTranslationService,
    private activatedRoute: ActivatedRoute,
    private employeeSelfService: EmployeeMySelfService
  ) {
    super();
  }

  ngOnInit(): void {

    if (!this.isTypeInFormGrid) {
      // Kiểm tra param trong query
      const subParam = this.activatedRoute.queryParams.subscribe(params => {
        if (params && Object.keys(params).length > 0) {
          const id = params["id"];
          if (id) {
            this.objectID = id;
          }
        }
        this.initForm();
      });

      this.unSubscribles.push(subParam);
    }
  }

  //#region Init form

  /**
   * Bắt đầu vào form
   * @memberof AmisLayoutComponent
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
      case FormMode.Duplicate:
        this.initFormDuplicate();
        break;
    }
  }

  /**
   * set dữ liệu trước khi show
   * @param {any} groupConfig
   * @memberof AmisLayoutComponent
   * created by vhtruong - 21/07/2020
   */
  setDataBeforeShow(groupConfig) {
    groupConfig.GroupFieldConfigs?.forEach(gf => {
      if (this.listDataCloneAndChangeField?.length) {
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
      }
    })
  }

  /**
   *
   * @memberof AmisLayoutComponent
   * created by vhtruong - 15/06/2020
   */
  initFormInsert() {
    this.typeShowControl = {
      IsEditable: false,
      IsViewOnly: false,
      IsViewEditable: false,
      SubSystemCode: this._permissionSystemCode,
      PermissionCode: this._permissionCode
    };
    this.validateInfos = [];
    let id = this.objectID ? this.objectID : null;
    this.amisDataService.getDataDefaultBinding(this._controller, this._subSystemCode, this._layoutConfidID, id).subscribe(res => {
      if (res?.Success && res.Data) {
        if (this.listDataCloneAndChangeField?.length) {
          res.Data.GroupConfigs.forEach(t => {
            this.setDataBeforeShow(t);
            t.ListGroupConfigChild?.forEach(tc => {
              this.setDataBeforeShow(tc);
            })
          })
        }
        if (!this.objectData) {
          this.objectData = AmisCommonUtils.cloneData(res.Data);
        }
        this.listGroupConfigs = GroupConfigUtils.GetData(res.Data.GroupConfigs);
        this.objectData["GroupConfigs"] = this.listGroupConfigs;
        this.objectData["DependentDatas"] = null;
        this.objectData["DependentDictionaries"] = null;
        this.objectData["ConfigValidates"] = null;
        this.listDependentData = res.Data.DependentDatas;
        this.listDependentDictionaries = res.Data.DependentDictionaries;
        this.listConfigValidates = res.Data.ConfigValidates;
        this.objectData.State = FormMode.Insert;
        this.isLoading = false;
        return;
      }
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
    })
  }




  /**
   * Nhân bản
   * @memberof AmisLayoutComponent
   * created by vhtruong - 19/06/2020
   */
  initFormDuplicate() {
    this.typeShowControl = {
      IsEditable: false,
      IsViewOnly: false,
      IsViewEditable: false,
      SubSystemCode: this._permissionSystemCode,
      PermissionCode: this._permissionCode
    };
    this.validateInfos = [];
    this.amisDataService.getDataDefaultBinding(this._controller, this._subSystemCode, this._layoutConfidID, this.objectID).subscribe(res => {
      if (res?.Success && res.Data) {
        this.listGroupConfigs = GroupConfigUtils.GetData(res.Data.GroupConfigs);
        this.objectData = AmisCommonUtils.cloneData(res.Data);
        this.objectData["GroupConfigs"] = this.listGroupConfigs;
        this.listDependentData = res.Data.DependentDatas;
        this.listDependentDictionaries = res.Data.DependentDictionaries;
        this.listConfigValidates = res.Data.ConfigValidates;
        this.objectData.State = FormMode.Insert;
        this.isLoading = false;
        return;
      }
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
    })
  }

  /**
   *
   * @memberof AmisLayoutComponent
   * created by vhtruong - 15/06/2020
   */
  initFormEdit() {
    this.typeShowControl = {
      IsEditable: false,
      IsViewOnly: false,
      IsViewEditable: false,
      SubSystemCode: this._permissionSystemCode,
      PermissionCode: this._permissionCode
    };
    this.validateInfos = [];
    // this.isNoData = true;
    if (this.objectID) {
      const obj = {
        SubsystemCode: this._subSystemCode,
        LayoutConfigID: this._layoutConfidID,
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
            this.listGroupConfigs = GroupConfigUtils.GetData(this.layoutConfig.ListGroupConfig);
            this.listDependentData = this.layoutConfig.DependentDatas;
            this.listDependentDictionaries = this.layoutConfig.DependentDictionaries;
            this.listConfigValidates = res.Data.ConfigValidates;
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

  /**
   *
   * @memberof AmisLayoutComponent
   * created by vhtruong - 15/06/2020
   */
  initFormView() {
    this.typeShowControl = {
      IsEditable: false,
      IsViewOnly: true,
      IsViewEditable: false,
      SubSystemCode: this._permissionSystemCode,
      PermissionCode: this._permissionCode
    };
    // this.isNoData = true;
    if (this.objectID) {
      const obj = {
        SubsystemCode: this._subSystemCode,
        LayoutConfigID: this._layoutConfidID,
        MasterValue: this.objectID,
        EmployeeID: this.employeeID
      }
      if (this.callFromEmployeeApp) {
        this.getLayoutAndDataUnAuth(obj);
      } else {
        this.getViewLayoutConfigAndData(obj);
      }

    }
  }

  /**
   * Lấy layout và dữ liệu nếu gọi từ app nhân viên (bỏ qua check quyền)
   * nmduy 25/09/2020
   */
  getLayoutAndDataUnAuth(obj) {
    obj[this.masterIDField] = this.masterIDValue;
    this.employeeSelfService.getLayoutAndData(obj).subscribe(res => {
      if (res?.Success && res.Data) {
        this.handleResponseData(res.Data);
        return;
      }
      // this.isNoData = true;
      this.isLoading = false;
    }, error => {
      // this.isNoData = true;
      this.isLoading = false;
    })
  }

  /**
   * Lấy layout và dữ liệu bind lên form
   * nmduy 25/09/2020
   */
  getViewLayoutConfigAndData(obj) {
    this.amisDataService.getLauoutConfigAndData(obj).subscribe(res => {
      if (res?.Success && res.Data) {
        this.handleResponseData(res.Data);
        return;
      }
      // this.isNoData = true;
      this.isLoading = false;
    }, error => {
      // this.isNoData = true;
      this.isLoading = false;
    })
  }


  /**
   * Xử lý dữ liệu trả về
   * nmduy 25/09/2020
   */
  handleResponseData(data) {
    if (data.MasterData) {
      this.layoutConfig = data;
      this.objectData = this.layoutConfig.MasterData;
      this.objectData.State = FormMode.Update;
      this.objectData["GroupConfigs"] = this.layoutConfig.ListGroupConfig;
      this.listGroupConfigs = GroupConfigUtils.GetData(this.layoutConfig.ListGroupConfig);
      this.listDependentData = this.layoutConfig.DependentDatas;
      this.listDependentDictionaries = this.layoutConfig.DependentDictionaries;
      // this.isNoData = false;
    }
    this.isLoading = false;
  }

  //#endregion

  //#region Xử lý action liên quan

  /**
   * Sau khi validate
   * @param {any} e
   * @memberof AmisLayoutComponent
   * created by vhtruong - 15/06/2020
   */
  afterValidated(e) {
    this.afterValidatedForm.emit(e);
    if (e?.length) {
      return;
    }
    this.amisTransferSV.showLoading("", "amis-f-layout");
    switch (this._formMode) {
      case FormMode.Insert:
        this.saveDataInsert();
        break;
      case FormMode.Update:
        this.saveDataEdit();
        break;
      case FormMode.Duplicate:
        this.saveDataInsert();
        break;
    }
  }


  /**
   *
   * @memberof AmisLayoutComponent
   */
  cancel() {
    if (this.isChangedData) {
      this.popupNotifyContent = this.amisTranslateSV.getValueByKey("CANCEL_RECENT_TYPE_CONTENT");
      this.showPopupNotify();
    }
    else {
      this.onConfirm();
    }
  }


  /**
   *
   * @param {any} formMode
   * @memberof AmisLayoutComponent
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
   * @memberof AmisLayoutComponent
   * created by vhtruong - 15/06/2020
   */
  saveDataInsert() {
    let param = AmisCommonUtils.cloneData(this.objectData);
    param.State = FormMode.Insert;
    if (this.masterIDValue) {
      param[this.masterIDField] = this.masterIDValue;
    }

    if (this.objectType) {
      param.GroupConfigs = [];
      param.CustomData = {};
      param.CustomData["SubSystemCode"] = this.subSystemCode;

      this.objectData.GroupConfigs.forEach(p => {
        if (p.TableName && this.objectType) {

          // Xem masterobject có config detail hay không
          if (this.objectType.ModelDetailConfigs?.length) {

            // Kiểm tra xem groupconfig thuộc detail hay master
            let objDetailOnMaster = this.objectType.ModelDetailConfigs.find(x => x.TableName === p.TableName);

            // Nếu groupconfig thuộc detail chứ không phải master
            if (objDetailOnMaster) {

              // Dựa vào config detail tạo modeldetail
              if (!param[objDetailOnMaster.PropertyOnMasterName]?.length) {
                param[objDetailOnMaster.PropertyOnMasterName] = [];
              }

              // Nếu group config dạng nhập liệu thì tạo object mới add vào list object detail trong master hoặc cập nhật vào object cũ
              if (p.GroupType === GroupType.Field) {
                if (param[objDetailOnMaster.PropertyOnMasterName]?.length) {
                  param[objDetailOnMaster.PropertyOnMasterName][0]["CustomData"] = {};
                  p.GroupFieldConfigs?.forEach(gf => {
                    param[objDetailOnMaster.PropertyOnMasterName][0][gf.FieldName] = gf.Value;
                    if (gf.DisplayField) {
                      param[objDetailOnMaster.PropertyOnMasterName][0][gf.DisplayField] = gf.ValueText;
                    }

                    // Nếu là kiểu upload tài liệu thì add ListFileTemp trong custom data
                    if (gf.TypeControl === TypeControl.UploadDocument) {
                      if (gf["ListFileTemp"] && gf.Value) {
                        if (!param[objDetailOnMaster.PropertyOnMasterName][0]["CustomData"]?.ListFileTemp?.length) {
                          param[objDetailOnMaster.PropertyOnMasterName][0]["CustomData"].ListFileTemp = [];
                        }
                        param[objDetailOnMaster.PropertyOnMasterName][0]["CustomData"].ListFileTemp.push(...gf["ListFileTemp"]);
                      }
                    }

                    // Nếu group field config có passwarningcode thì thêm vào customdata
                    if (gf.PassWarningCode?.length) {
                      if (!param[objDetailOnMaster.PropertyOnMasterName][0]["CustomData"]["PassWarningCode"]) {
                        param[objDetailOnMaster.PropertyOnMasterName][0]["CustomData"]["PassWarningCode"] = {};
                      }
                      param[objDetailOnMaster.PropertyOnMasterName][0]["CustomData"]["PassWarningCode"][gf.FieldName] = gf.PassWarningCode[0];
                    }
                  });
                } else {
                  let obj = {};
                  obj["CustomData"] = {};
                  obj["State"] = FormMode.Insert;
                  p.GroupFieldConfigs?.forEach(gf => {
                    obj[gf.FieldName] = gf.Value;
                    if (gf.DisplayField) {
                      obj[gf.DisplayField] = gf.ValueText;
                    }

                    // Nếu là kiểu upload tài liệu thì add ListFileTemp trong custom data
                    if (gf.TypeControl === TypeControl.UploadDocument) {
                      if (gf["ListFileTemp"] && gf.Value) {
                        if (!obj["CustomData"]?.ListFileTemp?.length) {
                          obj["CustomData"].ListFileTemp = [];
                        }
                        obj["CustomData"].ListFileTemp.push(...gf["ListFileTemp"]);
                      }
                    }

                    // Nếu group field config có passwarningcode thì thêm vào customdata
                    if (gf.PassWarningCode?.length) {
                      if (!obj["CustomData"]["PassWarningCode"]) {
                        obj["CustomData"]["PassWarningCode"] = {};
                      }
                      obj["CustomData"]["PassWarningCode"][gf.FieldName] = gf.PassWarningCode[0];
                    }
                  });
                  param[objDetailOnMaster.PropertyOnMasterName].push(obj);
                }
              }
              // Nếu group config dạng grid thì thêm list object vào list object detail trong master 
              else if (p.GroupType === GroupType.Grid && p.DataGroupConfig) {
                param[objDetailOnMaster.PropertyOnMasterName].push(...p.DataGroupConfig);
              }
              return;
            }
          }
        }

        // Nếu group config thuộc master
        if (p.GroupType === GroupType.Field) {
          p.GroupFieldConfigs?.forEach(gf => {
            param[gf.FieldName] = gf.Value;
            if (gf.DisplayField) {
              param[gf.DisplayField] = gf.ValueText;
            }

            // Nếu là kiểu upload tài liệu thì add ListFileTemp trong custom data
            if (gf.TypeControl === TypeControl.UploadDocument) {
              if (gf["ListFileTemp"] && gf.Value) {
                if (!param.CustomData?.ListFileTemp?.length) {
                  param.CustomData.ListFileTemp = [];
                }
                param.CustomData.ListFileTemp.push(...gf["ListFileTemp"]);
              }
            }

            // Nếu group field config có passwarningcode thì thêm vào customdata
            if (gf.PassWarningCode?.length) {
              if (!param["CustomData"]["PassWarningCode"]) {
                param["CustomData"]["PassWarningCode"] = {};
              }
              param["CustomData"]["PassWarningCode"][gf.FieldName] = gf.PassWarningCode[0];
            }
          });
        } else if (p.GroupType === GroupType.Grid) {

        }
      })

      param = this.trimProperties(param);
    } else {
      param.GroupConfigs = AmisCommonUtils.cloneDataArray(this.objectData.GroupConfigs);
      param.GroupConfigs.forEach(p => {
        p.ListGroupConfigChild = [];
        p.ColOne = [];
        p.ColTwo = [];
        p.GroupFieldConfigs.forEach(field => {
          field = this.trimProperties(field);
        })
      })
    }

    this.amisDataService.save(this._controller, param).subscribe(res => {
      this.amisTransferSV.hideLoading();
      if (res?.Success) {
        if (res.Data) {
          if (this.actionSaveData === SaveDataType.Save) {
            if (this.formModeSaveData === FormMode.Insert) {
              this.amisTransferSV.showSuccessToast(this.amisTranslateSV.getValueByKey(this.KeyToastSuccess ? this.KeyToastSuccess : "ADD_SUCCESS"));
              this.afterSaveSuccess.emit({
                FormModeSaveData: this.formModeSaveData,
                FormMode: FormMode.Insert,
                Data: res.Data,
                GroupConfig: this.groupConfig,
                IsReloadData: true,
                Success: res.Success
              });
            } else if (this.formModeSaveData === FormMode.SaveAndInsert) {
              this.amisTransferSV.showSuccessToast(this.amisTranslateSV.getValueByKey(this.KeyToastSuccess ? this.KeyToastSuccess : "ADD_SUCCESS"));
              this.submitObject = AmisCommonUtils.cloneData({ IsSubmit: false });
              this.objectAfterSubmit = AmisCommonUtils.cloneData({ IsFocusFirstItem: true });
              this.isChangedData = false;
              if (this._formMode == FormMode.Insert) {
                this.initFormInsert();
              } else if (this._formMode == FormMode.Duplicate) {
                this.initFormDuplicate();
              }
              this.afterSaveSuccess.emit({
                FormModeSaveData: this.formModeSaveData,
                FormMode: FormMode.SaveAndInsert,
                Data: res.Data,
                GroupConfig: this.groupConfig
              });
            }
          } else if (this.actionSaveData === SaveDataType.Cancel) {
            this.amisTransferSV.showSuccessToast(this.amisTranslateSV.getValueByKey(this.KeyToastSuccess ? this.KeyToastSuccess : "ADD_SUCCESS"));
            this.afterCancel.emit({
              IsReloadData: true
            })
          }
          return;
        }
      } else {
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


  /**
   * Lưu dữ liệu sửa
   * @memberof AmisLayoutComponent
   * created by vhtruong - 15/06/2020
   */
  saveDataEdit() {
    let param = AmisCommonUtils.cloneData(this.objectData);

    if (this.objectType) {
      param.GroupConfigs = [];
      param.CustomData = {};
      param.CustomData["SubSystemCode"] = this.subSystemCode;

      this.objectData.GroupConfigs.forEach(p => {
        if (p.TableName && this.objectType) {

          // Xem masterobject có config detail hay không
          if (this.objectType.ModelDetailConfigs?.length) {

            // Kiểm tra xem groupconfig thuộc detail hay master
            let objDetailOnMaster = this.objectType.ModelDetailConfigs.find(x => x.TableName === p.TableName);

            // Nếu groupconfig thuộc detail chứ không phải master
            if (objDetailOnMaster) {

              // Dựa vào config detail tạo modeldetail
              if (!param[objDetailOnMaster.PropertyOnMasterName]?.length) {
                param[objDetailOnMaster.PropertyOnMasterName] = [];
              }

              // Nếu group config dạng nhập liệu thì tạo object mới add vào list object detail trong master hoặc cập nhật vào object cũ
              if (p.GroupType === GroupType.Field) {
                if (param[objDetailOnMaster.PropertyOnMasterName]?.length) {
                  param[objDetailOnMaster.PropertyOnMasterName][0]["CustomData"] = {};
                  p.GroupFieldConfigs?.forEach(gf => {
                    param[objDetailOnMaster.PropertyOnMasterName][0][gf.FieldName] = gf.Value;
                    if (gf.DisplayField) {
                      param[objDetailOnMaster.PropertyOnMasterName][0][gf.DisplayField] = gf.ValueText;
                    }

                    // Nếu là kiểu upload tài liệu thì add ListFileTemp trong custom data
                    if (gf.TypeControl === TypeControl.UploadDocument) {
                      if (gf["ListFileTemp"] && gf.Value) {
                        if (!param[objDetailOnMaster.PropertyOnMasterName][0]["CustomData"]?.ListFileTemp?.length) {
                          param[objDetailOnMaster.PropertyOnMasterName][0]["CustomData"].ListFileTemp = [];
                        }
                        param[objDetailOnMaster.PropertyOnMasterName][0]["CustomData"].ListFileTemp.push(...gf["ListFileTemp"]);
                      }
                    }

                    // Nếu group field config có passwarningcode thì thêm vào customdata
                    if (gf.PassWarningCode?.length) {
                      if (!param[objDetailOnMaster.PropertyOnMasterName][0]["CustomData"]["PassWarningCode"]) {
                        param[objDetailOnMaster.PropertyOnMasterName][0]["CustomData"]["PassWarningCode"] = {};
                      }
                      param[objDetailOnMaster.PropertyOnMasterName][0]["CustomData"]["PassWarningCode"][gf.FieldName] = gf.PassWarningCode[0];
                    }
                  });
                } else {
                  let obj = {};
                  obj["CustomData"] = {};
                  obj["State"] = FormMode.Insert;
                  obj[this.masterIDField] = this.objectData[this.masterIDField];
                  p.GroupFieldConfigs?.forEach(gf => {
                    obj[gf.FieldName] = gf.Value;
                    if (gf.DisplayField) {
                      obj[gf.DisplayField] = gf.ValueText;
                    }

                    // Nếu là kiểu upload tài liệu thì add ListFileTemp trong custom data
                    if (gf.TypeControl === TypeControl.UploadDocument) {
                      if (gf["ListFileTemp"] && gf.Value) {
                        if (!obj["CustomData"]?.ListFileTemp?.length) {
                          obj["CustomData"].ListFileTemp = [];
                        }
                        obj["CustomData"].ListFileTemp.push(...gf["ListFileTemp"]);
                      }
                    }

                    // Nếu group field config có passwarningcode thì thêm vào customdata
                    if (gf.PassWarningCode?.length) {
                      if (!obj["CustomData"]["PassWarningCode"]) {
                        obj["CustomData"]["PassWarningCode"] = {};
                      }
                      obj["CustomData"]["PassWarningCode"][gf.FieldName] = gf.PassWarningCode[0];
                    }
                  });
                  param[objDetailOnMaster.PropertyOnMasterName].push(obj);
                }
              }
              // Nếu group config dạng grid thì thêm list object vào list object detail trong master 
              else if (p.GroupType === GroupType.Grid && p.DataGroupConfig) {
                param[objDetailOnMaster.PropertyOnMasterName].push(...p.DataGroupConfig);
              }
              return;
            }
          }
        }

        // Nếu group config thuộc master
        if (p.GroupType === GroupType.Field) {
          p.GroupFieldConfigs?.forEach(gf => {
            param[gf.FieldName] = gf.Value;
            if (gf.DisplayField) {
              param[gf.DisplayField] = gf.ValueText;
            }

            // Nếu là kiểu upload tài liệu thì add ListFileTemp trong custom data
            if (gf.TypeControl === TypeControl.UploadDocument) {
              if (gf["ListFileTemp"] && gf.Value) {
                if (!param.CustomData?.ListFileTemp?.length) {
                  param.CustomData.ListFileTemp = [];
                }
                param.CustomData.ListFileTemp.push(...gf["ListFileTemp"]);
              }
            }

            // Nếu group field config có passwarningcode thì thêm vào customdata
            if (gf.PassWarningCode?.length) {
              if (!param["CustomData"]["PassWarningCode"]) {
                param["CustomData"]["PassWarningCode"] = {};
              }
              param["CustomData"]["PassWarningCode"][gf.FieldName] = gf.PassWarningCode[0];
            }
          });
        } else if (p.GroupType === GroupType.Grid) {

        }
      })

      param = this.trimProperties(param);
    } else {
      param.GroupConfigs = AmisCommonUtils.cloneDataArray(this.objectData.GroupConfigs);
      param.GroupConfigs.forEach(p => {
        p.ListGroupConfigChild = [];
        p.ColOne = [];
        p.ColTwo = [];
        p.GroupFieldConfigs.forEach(field => {
          field = this.trimProperties(field);
        })
      })
    }
    param.State = FormMode.Update;

    this.amisDataService.save(this._controller, param).subscribe(res => {
      this.amisTransferSV.hideLoading();
      if (res?.Success) {
        this.amisTransferSV.showSuccessToast(this.amisTranslateSV.getValueByKey(this.KeyToastSuccess ? this.KeyToastSuccess : "EDIT_SUCCESS"));
        if (this.actionSaveData === SaveDataType.Save) {
          this.afterSaveSuccess.emit({
            FormModeSaveData: FormMode.Update,
            FormMode: FormMode.Update,
            Data: res.Data,
            GroupConfig: this.groupConfig,
            IsReloadData: true
          });
        } else if (this.actionSaveData === SaveDataType.Cancel) {
          this.afterCancel.emit({
            IsReloadData: true
          })
        }
        return;
      } else {
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

  //#endregion

  //#region Popup confirm cancel


  /**
   * Đóng popup cancel
   * @memberof AmisLayoutComponent
   * created by vhtruong - 15/06/2020
   */
  closePopupNotify() {
    this.visiblePopupNotify = false;
  }

  /**
   * Nhấn confirm trên popup notify
   * @memberof AmisLayoutComponent
   * created by vhtruong - 12/06/2020
   */
  onConfirm() {
    this.closePopupNotify();
    this.afterCancel.emit();
  }


  /**
   * Hiển thị popup thông báo
   * @memberof AmisLayoutComponent
   */
  showPopupNotify() {
    this.visiblePopupNotify = true;
  }

  //#endregion

  //#region Sự kiện nhận từ form

  /**
   * Một giá trị field thay đổi
   * @param {any} e
   * @memberof AmisLayoutComponent
   * created by vhtruong - 15/06/2020
   */
  changedFieldValue(e) {
    this.isChangedData = true;
    this.valueFieldChanged.emit(e);
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
        ObjectData: this.objectData,
        GroupConfig: this.groupConfig,
        FormModeSaveData: this.formModeSaveData,
        FormMode: this._formMode,
        ActionSaveData: this.actionSaveData
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
          ObjectData: this.objectData,
          GroupConfig: this.groupConfig,
          FormModeSaveData: this.formModeSaveData,
          FormMode: this._formMode,
          ActionSaveData: this.actionSaveData
        }
        this.onClickYesEvent.emit(param);
      } else {
        if (this.formMode == FormMode.Insert || this.formMode == FormMode.Duplicate) {
          this.saveDataInsert();
        } else if (this.formMode == FormMode.Update) {
          this.saveDataEdit();
        }
      }
    }
  }

  //#endregion


  /**
   * Sự kiện chạy sau khi thay đổi dữ liệu trên 1 grid
   * @param {any} e
   * @memberof AmisLayoutComponent
   * created by vhtruong - 21/07/2020
   */
  afterChangedDataGrid(e) {
    if (this.fnsChangedDataGrid) {
      this.fnsChangedDataGrid(this.formgroup, e);
    }
  }

  /**
   * Focus out khỏi field
   * @param {any} e
   * created by vhtruong - 30/07/2020
   */
  focusOutItem(e) {
    this.focusOutField.emit(e);
  }


  /**
   * Thực hiện trim tất cả các prop của object là string
   *
   * @param {any} object
   * @returns
   * @memberof AmisLayoutComponent
   * CREATEAD: PTSY 13/8/2020
   */
  trimProperties(object) {
    if (object) {

      Object.keys(object).map(k => {
        if (typeof object[k] == "string") {
          object[k] = object[k].trim()
        }
      });
      return object;
    }
  }
}
