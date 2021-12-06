import { Component, OnInit, SimpleChanges } from '@angular/core';
import { AmisControlGroupComponent } from 'src/common/components/amis-control-group/amis-control-group.component';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { AmisDataService } from 'src/common/services/amis-data.service';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { FormMode } from 'src/common/enum/form-mode.enum';
import { GroupConfig } from '../../models/group-config/group-config';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { GroupType } from '../../enum/group-config/group-type.enum';
import { EmployeeMySelfService } from 'src/app/services/employee-myself/employee-myself.service';
import { checkDependentData } from 'src/common/fn/operator-utils';
import { OperatorType } from 'src/common/enum/operator-type.enum';

@Component({
  selector: 'amis-hrm-employee-self',
  templateUrl: './hrm-employee-self.component.html',
  styleUrls: ['./hrm-employee-self.component.scss']
})
export class HrmEmployeeSelfComponent extends AmisControlGroupComponent implements OnInit {

  constructor(
    public amisTransferDataService: AmisTransferDataService,
    public amisDataService: AmisDataService,
    public amisTranslateSV: AmisTranslationService,
    public mySelfService: EmployeeMySelfService
  ) {
    super(amisTransferDataService, amisDataService, amisTranslateSV, mySelfService);
  }

  ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
  }

  ngOnInit(): void {

    super.ngOnInit();
  }

  /**
   * override hàm thay đổi giá trị 
   * nmduy 06/10/2020
   */
  valueChangedData(e) {
    super.valueChangedData(e);
    if (e.Data) {
      let groupFieldConfig = e.Data;
      if (!checkDependentData(groupFieldConfig.Value, groupFieldConfig.DataType, OperatorType.Equal, groupFieldConfig.OldValue)) {
        e.Data.State = FormMode.Update;
      } else {
        e.Data.State = FormMode.None;
      }
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
      groupbox.UpdatedDataGroupConfig = [];
      this.mySelfService.getDataByGroupConfigs(param).subscribe(res => {
        if (res?.Success && res.Data?.length) {
          if (groupbox.GroupType === GroupType.Grid) {
            groupbox.DataGroupConfig = res.Data[0].DataGroupConfig === null || res.Data[0].DataGroupConfig === undefined ? AmisCommonUtils.cloneDataArray([]) : AmisCommonUtils.cloneDataArray(res.Data[0].DataGroupConfig);
            if (groupbox.DataGroupConfig?.length) {
              for (let index = 0; index < groupbox.DataGroupConfig.length; index++) {
                const element = AmisCommonUtils.cloneData(groupbox.DataGroupConfig[index]);
                if (element.State == FormMode.Update && element.UpdatedFields) {
                  groupbox.UpdatedDataGroupConfig.push(element.UpdatedFields);
                } else {
                  groupbox.UpdatedDataGroupConfig.push(element);
                }
              }
            }
          } else {
            groupbox.GroupFieldConfigs = res.Data[0].GroupFieldConfigs;
          }
          groupbox.IsLoadedData = true;
        }
      });
    }
  }
}
