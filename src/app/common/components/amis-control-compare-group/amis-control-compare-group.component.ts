import { Component, OnInit, Input } from '@angular/core';
import { GroupConfig } from 'src/app/shared/models/group-config/group-config';
import { LayoutConfig } from 'src/app/shared/models/layout-config/layout-config';
import { GroupType } from 'src/app/shared/enum/group-config/group-type.enum';
import { GroupFieldConfig } from 'src/app/shared/models/group-field-config/group-field-config';
import { Observable } from 'rxjs';
import { FormMode } from 'src/common/enum/form-mode.enum';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { EmployeeSelfService } from 'src/app/services/employee-myself/employee-self.service';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { TransferDataService } from 'src/app/services/base/transfer-data.service';

@Component({
  selector: 'amis-amis-control-compare-group',
  templateUrl: './amis-control-compare-group.component.html',
  styleUrls: ['./amis-control-compare-group.component.scss']
})
export class AmisControlCompareGroupComponent implements OnInit {

  groupType = GroupType;

  _title = "";

  _groupConfig: GroupConfig;

  _layoutConfig: LayoutConfig;

  _currentData;

  _updateData;

  setDataType;

  _currentDataEmployee;
  @Input() set groupConfig(data) {
    if (data) {
      this._groupConfig = data;
      if (data.GroupType == this.groupType.Grid) {
        this.loadGroupFieldConfig().subscribe(data => {
          if (data) {
            this.setDataForGroupGrid();
            setTimeout(() => {

              this.isLoadGroupField = true;
            }, 200);
          }
        })
      }
      else {
        this.setDataForGroupRow();
      }

    }
  }

  @Input() set compareData(data) {
    if (data) {
      this._layoutConfig = data.LayoutConfig
      this._currentData = data.DataCurrent
      this._currentDataEmployee = AmisCommonUtils.cloneDeepData(this._currentData);
      this._updateData = data.EmployeeSelfServices
      this.setDataForGroupRow();
      this.setDataForGroupGrid();
    }
  }




  _groupFieldConfigs: GroupFieldConfig[] = [];

  _dataCompareGroupRows = [];

  _dataCurrentGrid = [];

  _dataUpdateGrid = [];

  isLoadGroupField = false;
  constructor(
    private employeeSelfService: EmployeeSelfService,
    private amisTranferSV: AmisTransferDataService,
    private tranferSV: TransferDataService
  ) { }

  ngOnInit(): void {

  }


  /**
   * Set dữ liệu group row
   *
   * @memberof AmisControlCompareGroupComponent
   * CREATED: PTSY 18/9/2020
   */
  setDataForGroupRow() {
    this._dataCompareGroupRows = []
    this._updateData?.forEach(e => {

      if (e.GroupConfigCode == this._groupConfig?.GroupConfigCode) {
        const currentData = {
          FieldName: e.FieldName,
          Value: this._currentDataEmployee[e.TableName]?.length ? this._currentDataEmployee[e.TableName][0][e.FieldName] : null,
          ValueText: this._currentDataEmployee[e.TableName]?.length ? this._currentDataEmployee[e.TableName][0][e.DisplayField] : null
        }
        const dataCompare = {
          CurrentValue: currentData,
          UpdateValue: JSON.parse(e.Data),
          Caption: e.Caption,
          TypeControl: e.TypeControl,
          DataType: e.DataType,
          DataUpdate: e,
          DataCurrent: this._currentDataEmployee[e.TableName][0]
        }
        this._dataCompareGroupRows.push(dataCompare);

      }
      else {
        const listChildCode = this._groupConfig?.ListGroupConfigChild?.map(e => e.GroupConfigCode);
        if (listChildCode?.includes(e.GroupConfigCode)) {
          const currentData = {
            FieldName: e.FieldName,
            Value: this._currentDataEmployee[e.TableName]?.length ? this._currentDataEmployee[e.TableName][0][e.FieldName] : null,
            ValueText: this._currentDataEmployee[e.TableName]?.length ? this._currentDataEmployee[e.TableName][0][e.DisplayField] : null
          }
          const dataCompare = {
            CurrentValue: currentData,
            UpdateValue: JSON.parse(e.Data),
            Caption: e.Caption,
            TypeControl: e.TypeControl,
            DataType: e.DataType,
            DataUpdate: e,
            DataCurrent: this._currentDataEmployee[e.TableName][0]
          }
          this._dataCompareGroupRows.push(dataCompare);

        }

      }
    });
  }

  /**
   * Set dữ liệu group grid
   *
   * @memberof AmisControlCompareGroupComponent
   * CREATED: PTSY 18/9/2020
   */
  setDataForGroupGrid() {
    const updateDatas = AmisCommonUtils.cloneDeepData(this._updateData?.filter(e => e.GroupConfigCode == this._groupConfig?.GroupConfigCode));

    this._dataUpdateGrid = [];
    this._dataCurrentGrid = []
    if (updateDatas?.length) {

      this._dataCurrentGrid = this._currentData[updateDatas[0].TableName]

      updateDatas.forEach(e => {
        e.Data = JSON.parse(e.Data);
        e.Data.EmployeeSelfServicesID = e.EmployeeSelfServiceID
        return e.Data;
      });



      const dataCurrentClone = AmisCommonUtils.cloneDeepData(this._dataCurrentGrid)?.filter(e => {
        const tmp = updateDatas.filter(e => e.ModelState == FormMode.Delete);
        if (!tmp.map(v => v.Data[this._groupConfig.FieldID]).includes(e[this._groupConfig.FieldID])) {
          return true;
        }
      });
      // Bind dữ liệu hiện tại cho bảng dưới

      const dataCurrentRs = [];



      updateDatas.forEach(e => {
        if (e.ModelState == FormMode.Update) {
          const id = e.Data[this._groupConfig.FieldID];

          const currentObj = dataCurrentClone?.find(e => e[this._groupConfig.FieldID] == id);
          if (currentObj) {
            Object.getOwnPropertyNames(e.Data).forEach(d1 => {
              currentObj[d1] = e.Data[d1];
              currentObj[d1 + "CustomClass"] = "approve-text-edit";
            })
            currentObj["State"] = FormMode.Update;
            currentObj.EmployeeSelfServicesID = e.EmployeeSelfServiceID;
            dataCurrentRs.push(currentObj);
          }
          else {
            this.employeeSelfService.deleteDataByID(e.EmployeeSelfServiceID).subscribe(data => {
              if (data?.Success) {
                this.tranferSV.updateApproveData({
                  Type: "Approve",
                  Data: [{ EmployeeSelfServiceID: e.EmployeeSelfServiceID }]
                })
              }
            })
          }

        }
      })



      this._dataUpdateGrid.push(...updateDatas.filter(e => e.ModelState != FormMode.Update).map(d => d.Data));


      const dataUpdateGridClone = dataCurrentRs;

      for (let i = 0; i < updateDatas.length; i++) {
        const id = updateDatas[i].Data[this._groupConfig.FieldID];
        if (updateDatas[i].ModelState == FormMode.Insert) {

          const v = updateDatas[i].Data;
          Object.getOwnPropertyNames(v).forEach(e => {
            if (!e.includes("CustomClass")) {

              v[e + "CustomClass"] = "approve-text-insert";
            }
          })
          dataUpdateGridClone.push(v);
        }
        if (updateDatas[i].ModelState == FormMode.Delete) {
          this._dataUpdateGrid.forEach(v => {
            if (v[this._groupConfig.FieldID] == id) {
              Object.getOwnPropertyNames(v).forEach(e => {
                if (!e.includes("CustomClass")) {
                  v[e + "CustomClass"] = "approve-text-delete";

                }
              })
              dataUpdateGridClone.push(v);
            }
          })

        }
      }



      this._dataUpdateGrid = dataUpdateGridClone;
      if (dataCurrentClone) {

        this._dataUpdateGrid.push(...dataCurrentClone.filter(e => {
          return !dataUpdateGridClone.map(d => d[this._groupConfig.FieldID]).includes(e[this._groupConfig.FieldID]);
        }))
      }
    }
  }

  /**
   * Lấy dữ liệu group field config, data current của grid
   *
   * @returns {Observable<any>}
   * @memberof AmisControlCompareGroupComponent
   */
  loadGroupFieldConfig(): Observable<any> {
    return new Observable(noti => {
      if (this._updateData && this._updateData[0]?.EmployeeID) {
        const param = {
          GroupConfigID: this._groupConfig.GroupConfigID,
          EmployeeID: this._updateData[0].EmployeeID
        }
        this.isLoadGroupField = false;
        this.employeeSelfService.getDataByGroup(param).subscribe(data => {
          if (data?.Success) {
            this._groupConfig.GroupFieldConfigs = data?.Data?.GroupFieldConfigs;
            if (data?.Data?.DataCurrent) {
              this._currentData = data.Data.DataCurrent;
            }
            noti.next(true);
          }
          else {
            noti.next(false);
          }
        })
      }

    })
  }
}
