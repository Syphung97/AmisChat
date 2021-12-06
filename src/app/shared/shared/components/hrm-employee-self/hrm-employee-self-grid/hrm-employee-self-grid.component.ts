import { Component, Input, OnInit, ComponentFactoryResolver, Injector } from '@angular/core';
import { AmisControlGroupGridComponent } from 'src/common/components/amis-control-group/amis-control-group-grid/amis-control-group-grid.component';
import { AmisDataService } from 'src/common/services/amis-data.service';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { TransferDataService } from 'src/app/services/base/transfer-data.service';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { LayoutConfigGridService } from 'src/app/services/layout-grid-config/layout-grid-config.service';
import { AvatarService } from 'src/app/services/user/avatar.service';
import { FormMode } from 'src/common/enum/form-mode.enum';
import { TypeFormGrid } from 'src/app/shared/enum/form-grid/type-form-grid.enum';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { GroupConfigUtils } from 'src/app/shared/function/group-control-utils';
import { GroupType } from 'src/app/shared/enum/group-config/group-type.enum';
import { BaseHRMModel } from 'src/app/shared/models/base-hrm';
import { ContextMenu } from 'src/app/shared/enum/context-menu/context-menu.enum';
import { AmisDateUtils } from 'src/common/fn/date-utils';

@Component({
  selector: 'amis-hrm-employee-self-grid',
  templateUrl: './hrm-employee-self-grid.component.html',
  styleUrls: ['./hrm-employee-self-grid.component.scss']
})
export class HrmEmployeeSelfGridComponent extends AmisControlGroupGridComponent implements OnInit {


  constructor(
    public amisDataService: AmisDataService,
    public amisTransferSV: AmisTransferDataService,
    public transferDataSV: TransferDataService,
    public amisTranslateSV: AmisTranslationService,
    public readonly componentFactoryResolver: ComponentFactoryResolver,
    public readonly injector: Injector,
    public layoutGridSV: LayoutConfigGridService,
    public avatarSV: AvatarService
  ) {
    super(amisDataService, amisTransferSV, transferDataSV, amisTranslateSV, componentFactoryResolver, injector, layoutGridSV, avatarSV);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  /**
 * Nhận sự kiện hiển thị form từ group
 * @param {any} groupbox
 * @returns
 * @memberof AmisControlFormGroupComponent
 */
  addItemIntoGrid() {
    this.addItemGrid.emit({
      Action: FormMode.Insert,
      GroupConfig: this.groupbox
    });
    if (this.groupbox.IsNotUseDefaultFromDataGrid) {
      return;
    }
    this.showFormDataGrid();
  }



  /**
   * Bật form thêm
   * nmduy 22/09/2020
   */
  showFormDataGrid() {

    const obj = AmisCommonUtils.cloneData(this.groupbox);

    const masterIDField = obj.MappingConfigs?.length ? obj.MappingConfigs[0].DetailField : null;
    this.masterIDField = masterIDField;

    this.titleFormGrid = obj.GroupConfigName;

    this.objectDataGrid = new BaseHRMModel();

    let dataCloneAndChangeField = this.setDataBeforeShowForm();

    // Gọi sang phân hệ khác
    if (obj.SubsystemCodeGroup) {

      this.lazyLoadForm({
        Controller: obj.TableName,
        SubSystemCode: obj.SubsystemCodeGroup,
        FormMode: FormMode.Insert,
        Title: this.titleFormGrid,
        IsCallAPIInit: true,
        IsCallAPISave: false,
        GroupConfig: obj,
        IsDisplayHeader: true,
        MasterIDField: masterIDField,
        MasterIDValue: this.masterIDValue,
        DataCloneAndChangeField: dataCloneAndChangeField,
        TypeForm: TypeFormGrid.UseOtherForm,
        PermissionCode: this._typeShow.PermissionCode,
        PermissionSystemCode: this._typeShow.SubSystemCode,
        IsIgnorePermission: this._typeShow.IsInorgeSubSuystem,
        CallFromEmployeeApp: true
      })

    }
    // Sử dụng luôn các trường groupo field config
    else {

      obj.GroupFieldConfigs = AmisCommonUtils.cloneDataArray(this.groupbox.GroupFieldConfigs);
      obj.GroupType = GroupType.Field;
      obj.IsChild = false;
      obj.IsNotSetChild = true;
      let listGroup = [];
      listGroup.push(obj);
      listGroup.forEach(t => {
        t.DataGroupConfig = [];
        t.IsExpand = null;
        t.IsShowExpand = true;
        t.ColOne = [];
        t.ColTwo = [];
        if (t?.GroupFieldConfigs?.length) {
          t.GroupFieldConfigs.forEach(gf => {
            gf.Value = null;
            gf.ValueText = null;
          })
        }
      })

      this.objectDataGrid.GroupConfigs = AmisCommonUtils.cloneDataArray(GroupConfigUtils.GetData(listGroup));

      if (this._formMode === FormMode.Insert || this._formMode === FormMode.Duplicate) {

        this.lazyLoadForm({
          Controller: obj.TableName,
          SubSystemCode: obj.SubsystemCode,
          Data: this.objectDataGrid,
          FormMode: FormMode.Insert,
          Title: this.titleFormGrid,
          IsCallAPIInit: false,
          IsCallAPISave: false,
          GroupConfig: obj,
          IsDisplayHeader: false,
          MasterIDField: masterIDField,
          MasterIDValue: this.masterIDValue,
          DataCloneAndChangeField: dataCloneAndChangeField,
          TypeForm: TypeFormGrid.UseGroupFieldConfig,
          DependentClones: this.DependentClones,
          DependentDatas: this.DependentDatas,
          DependentDictionaries: this.DependentDictionaries,
          ConfigValidates: this.ConfigValidates,
          IsIgnorePermission: true,
          CallFromEmployeeApp: true

        })

      } else {

        this.lazyLoadForm({
          Controller: obj.TableName,
          SubSystemCode: obj.SubsystemCode,
          Data: this.objectDataGrid,
          FormMode: FormMode.Insert,
          Title: this.titleFormGrid,
          IsCallAPIInit: false,
          IsCallAPISave: false,
          GroupConfig: obj,
          IsDisplayHeader: false,
          MasterIDField: masterIDField,
          MasterIDValue: this.masterIDValue,
          DataCloneAndChangeField: dataCloneAndChangeField,
          TypeForm: TypeFormGrid.UseGroupFieldConfig,
          DependentClones: this.DependentClones,
          DependentDatas: this.DependentDatas,
          DependentDictionaries: this.DependentDictionaries,
          ConfigValidates: this.ConfigValidates,
          PermissionCode: this._typeShow.PermissionCode,
          PermissionSystemCode: this._typeShow.SubSystemCode,
          IsIgnorePermission: this._typeShow.IsInorgeSubSuystem,
          CallFromEmployeeApp: true

        })

      }

    }
  }


  /**
 * Sửa dữ liệu
 * @param {any} e
 * @memberof AmisControlFormGroupComponent
 * created by vhtruong - 26/05/2020
 */
  showFormEditDataGrid(data) {

    this.listGroupBoxDataGrid = [];

    if (data) {

      const dataObject = data.SelectedRow;

      if (dataObject) {

        this.objectDataGrid = dataObject;

        // Lấy index của object trong list data hiện tại
        this.indexData = -1;

        if (dataObject[this.groupbox.FieldID]) { // nếu bản ghi đc chọn có id thì là xóa bản ghi đã lưu trong db
          this.indexData = this.groupbox.DataGroupConfig?.findIndex(e => e[this.groupbox.FieldID] === dataObject[this.groupbox.FieldID]);
        } else {
          this.indexData = this.groupbox.DataGroupConfig?.findIndex(e => e.IndexGrid === dataObject.IndexGrid);
        }

        if (this.indexData != -1) {

          const obj = AmisCommonUtils.cloneData(this.groupbox);

          this.titleFormGrid = obj.GroupConfigName;

          let dataCloneAndChangeField = this.setDataBeforeShowForm();

          const masterIDField = obj.MappingConfigs?.length ? obj.MappingConfigs[0].DetailField : null;
          this.masterIDField = masterIDField;

          // Gọi sang phân hệ khác
          if (obj.SubsystemCodeGroup) {

            this.lazyLoadForm({
              Controller: obj.TableName,
              SubSystemCode: obj.SubsystemCodeGroup,
              FormMode: FormMode.Update,
              Title: this.titleFormGrid,
              IsCallAPIInit: true,
              IsCallAPISave: false,
              GroupConfig: obj,
              IsDisplayHeader: true,
              MasterIDValue: dataObject[obj.FieldID],
              ObjectID: dataObject[obj.FieldID],
              DataCloneAndChangeField: dataCloneAndChangeField,
              TypeForm: TypeFormGrid.UseOtherForm,
              Data: this.objectDataGrid,
              PermissionCode: this._typeShow.PermissionCode,
              PermissionSystemCode: this._typeShow.SubSystemCode,
              IsIgnorePermission: this._typeShow.IsInorgeSubSuystem,
              CallFromEmployeeApp: true

            })

          }
          // Sử dụng luôn các trường groupo field config
          else {

            obj.GroupType = GroupType.Field;
            obj.IsChild = false;
            obj.IsNotSetChild = true;
            let listGroup = [];
            listGroup.push(obj);
            const listGroupConfigs = AmisCommonUtils.cloneDataArray(GroupConfigUtils.GetData(listGroup));

            // Set value
            listGroupConfigs.forEach(t => {
              t.DataGroupConfig = [];
              t.IsExpand = null;
              t.IsShowExpand = true;
              if (t?.GroupFieldConfigs?.length) {
                t.GroupFieldConfigs.forEach(gf => {
                  gf.Value = dataObject[gf.FieldName];
                  gf.ValueText = dataObject[gf.DisplayField];
                })
              }
            })
            this.objectDataGrid.GroupConfigs = listGroupConfigs;

            if (this._formMode === FormMode.Insert || this._formMode === FormMode.Duplicate) {

              this.lazyLoadForm({
                Controller: obj.TableName,
                SubSystemCode: obj.SubsystemCode,
                Data: this.objectDataGrid,
                FormMode: FormMode.Update,
                Title: this.titleFormGrid,
                IsCallAPIInit: false,
                IsCallAPISave: false,
                GroupConfig: obj,
                IsDisplayHeader: false,
                MasterIDField: masterIDField,
                MasterIDValue: this.masterIDValue,
                DataCloneAndChangeField: dataCloneAndChangeField,
                TypeForm: TypeFormGrid.UseGroupFieldConfig,
                DependentClones: this.DependentClones,
                DependentDatas: this.DependentDatas,
                DependentDictionaries: this.DependentDictionaries,
                ConfigValidates: this.ConfigValidates,
                IsIgnorePermission: true,
                CallFromEmployeeApp: true

              })

            } else {

              this.lazyLoadForm({
                Controller: obj.TableName,
                SubSystemCode: obj.SubsystemCode,
                Data: this.objectDataGrid,
                FormMode: FormMode.Update,
                Title: this.titleFormGrid,
                IsCallAPIInit: false,
                IsCallAPISave: false,
                GroupConfig: obj,
                IsDisplayHeader: false,
                MasterIDField: masterIDField,
                MasterIDValue: this.masterIDValue,
                DataCloneAndChangeField: dataCloneAndChangeField,
                TypeForm: TypeFormGrid.UseGroupFieldConfig,
                DependentClones: this.DependentClones,
                DependentDatas: this.DependentDatas,
                DependentDictionaries: this.DependentDictionaries,
                ConfigValidates: this.ConfigValidates,
                PermissionCode: this._typeShow.PermissionCode,
                PermissionSystemCode: this._typeShow.SubSystemCode,
                IsIgnorePermission: this._typeShow.IsInorgeSubSuystem,
                CallFromEmployeeApp: true

              })
            }
          }
        }
      }
    }
  }

  /**
   * Sau khi thực hiện thay đổi dữ liệu trên grid
   * nmduy 16/09/2020
   */
  saveSuccessFormLazyLoad(event) {
    switch (event.FormModeSaveData) {
      case FormMode.Insert:
        if (event.Data) {
          this.objectDataGrid = event.Data;
          this.saveDataGrid(event);
        }
        this.closeFormLazyLoad();
        break;
      case FormMode.SaveAndInsert:
        if (event.Data) {
          this.objectDataGrid = event.Data;
          this.saveDataGrid(event);
        }
        break;
      case FormMode.Update:
        if (event.Data) {
          this.objectDataGrid = event.Data;
          if (this.objectDataGrid[this.groupbox.FieldID] && this.objectDataGrid.State != FormMode.Insert) { // nếu bản ghi có giá trị id => sửa bản ghi đã có
            this.saveDataGrid(event, FormMode.Update);
          } else {
            this.saveDataGrid(event);
          }
        }
        this.closeFormLazyLoad();
        break;
    }
  }

  /**
   * Lưu dữ liệu trên grid 
   * nmduy 16/09/2020
   */
  saveDataGrid(event, modelState = FormMode.Insert) {
    if (!this.groupbox.DataGroupConfig || !this.groupbox.DataGroupConfig?.length) {
      this.groupbox.DataGroupConfig = [];
      this.groupbox.UpdatedDataGroupConfig = [];
    }
    const dataObject = AmisCommonUtils.cloneData(this.setDataAfterSave(this.objectDataGrid));
    // Thêm mới
    if (event.FormMode == FormMode.Insert) {
      dataObject.IndexGrid = this.getIndexGrid();
      dataObject.State = modelState;
      dataObject[this.masterIDField] = this.masterIDValue;
      this.groupbox.DataGroupConfig?.push(dataObject);
      this.groupbox.UpdatedDataGroupConfig?.push(dataObject);
    }
    // Sửa
    else if (event.FormMode == FormMode.Update) {
      if (modelState == FormMode.Update) {
        this.handleUpdateItem(this.groupbox.DataGroupConfig[this.indexData], dataObject);
      } else {
        dataObject.State = modelState;
        dataObject[this.masterIDField] = this.masterIDValue;
        this.groupbox.UpdatedDataGroupConfig[this.indexData] = dataObject;
      }
      this.groupbox.DataGroupConfig[this.indexData] = dataObject;
    }
    this.groupbox.DataGroupConfig = AmisCommonUtils.cloneDataArray(this.groupbox.DataGroupConfig);
  }
  /**
   * xử lý bản ghi được cập nhật
   * nmduy 22/09/2020
   */
  handleUpdateItem(oldData, newData) {
    if (oldData && newData) {
      if (!this.groupbox.UpdatedDataGroupConfig[this.indexData]?.IsUpdated) { // nếu là lần đầu cập nhật thì gán lại bằng object rỗng 
        this.groupbox.UpdatedDataGroupConfig[this.indexData] = {};
      }
      for (let property in oldData) {
        if (!this.compareEqualValue(oldData[property], newData[property])) {
          this.groupbox.UpdatedDataGroupConfig[this.indexData][property] = newData[property];
        }
      }
      this.groupbox.UpdatedDataGroupConfig[this.indexData][this.groupbox.FieldID] = oldData[this.groupbox.FieldID];
      this.groupbox.UpdatedDataGroupConfig[this.indexData][this.masterIDField] = this.masterIDValue;
      this.groupbox.UpdatedDataGroupConfig[this.indexData].State = FormMode.Update;
      this.groupbox.UpdatedDataGroupConfig[this.indexData].IsUpdated = true;
    }
  }

  /**
   * so sánh 2 object khác nhauk hông
   * nmduy 22/09/2020
   */
  compareEqualValue(obj1, obj2) {
    if (obj1 == obj2 || (typeof obj2?.getMonth === 'function' && AmisDateUtils.compareSameDates(obj1, obj2)) || AmisCommonUtils.IsArray(obj2)) {
      return true;
    }
    return false;
  }


  /**
   * Click xem chi tiết 1 bản ghi
   * nmduy 21/09/2020
   */
  onClickRow(e, isViewOnly = false) {
    const dataObject = e?.key;

    if (dataObject) {

      this.objectDataGrid = dataObject;
      // Lấy index của object trong list data hiện tại
      if (dataObject[this.groupbox.FieldID]) {
        this.indexData = this.groupbox.DataGroupConfig?.findIndex(e => e[this.groupbox.FieldID] == dataObject[this.groupbox.FieldID]);
      } else {
        this.indexData = this.groupbox.DataGroupConfig?.findIndex(e => e.IndexGrid === dataObject.IndexGrid);
      }

      if (this.indexData != -1) {

        const obj = AmisCommonUtils.cloneData(this.groupbox);

        this.titleFormGrid = obj.GroupConfigName;

        let dataCloneAndChangeField = this.setDataBeforeShowForm();

        const masterIDField = obj.MappingConfigs?.length ? obj.MappingConfigs[0].DetailField : null;
        this.masterIDField = masterIDField;

        // Gọi sang phân hệ khác
        if (obj.SubsystemCodeGroup) {

          this.lazyLoadForm({
            Controller: obj.TableName,
            SubSystemCode: obj.SubsystemCodeGroup,
            FormMode: FormMode.View,
            Title: this.titleFormGrid,
            IsCallAPIInit: true,
            IsCallAPISave: false,
            GroupConfig: obj,
            IsDisplayHeader: true,
            MasterIDValue: this.masterIDValue,
            ObjectID: dataObject[obj.FieldID],
            DataCloneAndChangeField: dataCloneAndChangeField,
            TypeForm: TypeFormGrid.UseOtherForm,
            Data: this.objectDataGrid,
            PermissionCode: this._typeShow.PermissionCode,
            PermissionSystemCode: this._typeShow.SubSystemCode,
            IsIgnorePermission: this._typeShow.IsInorgeSubSuystem,
            IsViewOnly: isViewOnly ? true : this.isViewOnly,
            CallFromEmployeeApp: true,
          })

        }
        // Sử dụng luôn các trường groupo field config
        else {

          obj.GroupType = GroupType.Field;
          obj.IsChild = false;
          obj.IsNotSetChild = true;
          let listGroup = [];
          listGroup.push(obj);
          const listGroupConfigs = AmisCommonUtils.cloneDataArray(GroupConfigUtils.GetData(listGroup));

          // Set value
          listGroupConfigs.forEach(t => {
            t.DataGroupConfig = [];
            t.IsExpand = null;
            t.IsShowExpand = true;
            if (t?.GroupFieldConfigs?.length) {
              t.GroupFieldConfigs.forEach(gf => {
                gf.Value = dataObject[gf.FieldName];
                gf.ValueText = dataObject[gf.DisplayField];
              })
            }
          })
          this.objectDataGrid.GroupConfigs = listGroupConfigs;

          if (this._formMode === FormMode.Insert || this._formMode === FormMode.Duplicate) {

            this.lazyLoadForm({
              Controller: obj.TableName,
              SubSystemCode: obj.SubsystemCode,
              Data: this.objectDataGrid,
              FormMode: FormMode.View,
              Title: this.titleFormGrid,
              IsCallAPIInit: false,
              IsCallAPISave: false,
              GroupConfig: obj,
              IsDisplayHeader: false,
              MasterIDField: masterIDField,
              MasterIDValue: this.masterIDValue,
              DataCloneAndChangeField: dataCloneAndChangeField,
              TypeForm: TypeFormGrid.UseGroupFieldConfig,
              DependentClones: this.DependentClones,
              DependentDatas: this.DependentDatas,
              DependentDictionaries: this.DependentDictionaries,
              ConfigValidates: this.ConfigValidates,
              IsIgnorePermission: true,
              IsViewOnly: isViewOnly ? true : this.isViewOnly,
              CallFromEmployeeApp: true
            })

          } else {

            this.lazyLoadForm({
              Controller: obj.TableName,
              SubSystemCode: obj.SubsystemCode,
              Data: this.objectDataGrid,
              FormMode: FormMode.View,
              Title: this.titleFormGrid,
              IsCallAPIInit: false,
              IsCallAPISave: false,
              GroupConfig: obj,
              IsDisplayHeader: false,
              MasterIDField: masterIDField,
              MasterIDValue: this.masterIDValue,
              DataCloneAndChangeField: dataCloneAndChangeField,
              TypeForm: TypeFormGrid.UseGroupFieldConfig,
              DependentClones: this.DependentClones,
              DependentDatas: this.DependentDatas,
              DependentDictionaries: this.DependentDictionaries,
              ConfigValidates: this.ConfigValidates,
              PermissionCode: this._typeShow.PermissionCode,
              PermissionSystemCode: this._typeShow.SubSystemCode,
              IsIgnorePermission: this._typeShow.IsInorgeSubSuystem,
              IsViewOnly: isViewOnly ? true : this.isViewOnly,
              CallFromEmployeeApp: true
            })

          }

        }

      }
    }
  }


  /**
   * Sửa xóa dữ liệu trong grid 
   * nmduy 16/09/2020
   */
  eventItemInGrid(e) {
    if (e) {
      const data = e.Data;
      if (data?.ContextMenu) {
        // Xóa
        if (data?.ContextMenu === ContextMenu.Delete) {

          this.showPopupDeleteDataGrid(e);
        }
        // Sửa 
        else if (data?.ContextMenu === ContextMenu.Edit) {
          this.showFormEditDataGrid(data);
        }
      }
    }
  }

  /**
 * show form xóa
 * @param {any} e
 * @memberof AmisControlFormGroupComponent
 * created by vhtruong - 26/05/2020
 */
  showPopupDeleteDataGrid(e) {
    if (e) {
      this.dataDelete = e;
      const group = this.dataDelete.GroupConfig;
      this.contentPopupDelete = `Bạn có chắc chắn muốn xóa dữ liệu <strong>${group?.GroupConfigName}</strong> đã chọn hay không?`
      this.isShowDeleteDataGrid = true;
    }
  }

  /**
   * confirm xóa dữ liệu trên grid
   * nmduy 16/09/2020
   */
  deleteDataGrid(e) {
    this.isShowDeleteDataGrid = false;
    if (this.dataDelete) {
      let selectedRow = this.dataDelete.Data.SelectedRow;
      let indexData = -1;
      if (selectedRow[this.groupbox.FieldID]) { // nếu bản ghi đc chọn có id thì là xóa bản ghi đã lưu trong db
        indexData = this.groupbox.DataGroupConfig?.findIndex(e => e[this.groupbox.FieldID] === selectedRow[this.groupbox.FieldID]);
        if (selectedRow.IsInsertClient) {
          this.groupbox.DataGroupConfig.splice(indexData, 1);
          this.groupbox.UpdatedDataGroupConfig.splice(indexData, 1);
        } else {
          this.groupbox.DataGroupConfig[indexData].State = FormMode.Delete;
          this.groupbox.UpdatedDataGroupConfig[indexData] = AmisCommonUtils.cloneData(this.groupbox.DataGroupConfig[indexData]);
        }
      } else {
        indexData = this.groupbox.DataGroupConfig?.findIndex(e => e.IndexGrid === selectedRow.IndexGrid);
        if (selectedRow?.CustomConfig?.SelfService) { // nếu xóa bản ghi được thêm trước đó
          this.groupbox.DataGroupConfig[indexData].State = FormMode.Delete;
          this.groupbox.UpdatedDataGroupConfig[indexData] = AmisCommonUtils.cloneData(this.groupbox.DataGroupConfig[indexData]);
        } else {
          this.groupbox.DataGroupConfig.splice(indexData, 1);
          this.groupbox.UpdatedDataGroupConfig.splice(indexData, 1);
        }
      }
      if (indexData != -1) {
        this.groupbox.DataGroupConfig = AmisCommonUtils.cloneDataArray(this.groupbox.DataGroupConfig);
      }
    }
  }
}
