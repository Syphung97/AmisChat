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
import { OrganizationUnitService } from 'src/app/services/organizaion-unit/organization-unit.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { OrganizationUnit } from '../../models/organization-unit/organization-unit';
import { DxDropDownBoxComponent } from 'devextreme-angular';
import { AmisStringUtils } from 'src/common/fn/string-utils';
import { Employee } from '../../models/employee/employee';
import { ColumnGroup } from '../../enum/group-config/column-group.enum';
import { GroupType } from '../../enum/group-config/group-type.enum';
import { TypeControl } from '../../enum/common/type-control.enum';
import { LayoutConfigService } from 'src/app/services/layout-config/layout-config.service';
import { LayoutGridType } from '../../constant/layout-grid-type/layout-grid-type';
import { TransferDataService } from 'src/app/services/base/transfer-data.service';

@Component({
  selector: 'amis-popup-adjust-OrganizationUnit',
  templateUrl: './popup-adjust-OrganizationUnit.component.html',
  styleUrls: ['./popup-adjust-OrganizationUnit.component.scss']
})
export class PopupAdjustOrganizationUnitComponent extends BaseComponent
  implements OnInit {
  @Input()
  visiblePopup: boolean = false;
  title = '';
  height = 'auto';
  width = '500px';

  @Input()
  listEmployee = [];

  listEmployeeID = [];
  @Output()
  closePopup: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  afftersave: EventEmitter<any> = new EventEmitter<any>();

  formMode = FormMode;

  isError = false; // có lỗi khi lưu dữ liệu
  errorMessage = ''; // thông báo lỗi khi lưu dữ liệu

  // submit thông tin
  isSubmit: any;
  buttonColor = ButtonColor;
  // danh sách các trường
  listGroupConfigs = [];
  // Danh sách các trường phụ thuộc vào giá trị
  listDependentData = [];
    // Danh sách các trường phụ thuộc cha con
  listDependentDictionaries = [];
    // các trường validate
  listConfigValidates = [];
  fieldListConfig = [];
  // đối tượng hồ sơ truyền vào
  itemEmployee: any;
  employeeID : any;
  @ViewChild('dropdown', { static: false })
  dropdown: DxDropDownBoxComponent;
  isDisableSave = true;

  isLoading = false;

  typeShow = new TypeShowControl();
  constructor(
    private amisTransferSV: AmisTransferDataService,
    private organizationService: OrganizationUnitService,
    private translateSV: AmisTranslationService,
    private layoutConfigSV: LayoutConfigService,
    private amisDataService: AmisDataService,
    private employeeSV: EmployeeService,
    private transferData: TransferDataService,
  ) {
    super();

  }

  ngOnInit(): void {
    this.title = this.translateSV.getValueByKey(
      'POP_ADJUST_ORGANIZATION_TITLE'
    );
    this.isDisableSave = true;
    if(this.listEmployee?.length > 0){
      this.itemEmployee = new Employee();
      this.listEmployeeID = this.listEmployee.map(item => item.EmployeeID);
      this.employeeID = this.listEmployeeID?.length > 0 ? this.listEmployeeID[0] : 0;
    }

    this.getLayoutConfigAndData();
  }

  /**
   * Lấy config và data
   *  created by pvthong - 11/06/2020
   */
  getLayoutConfigAndData() {
    // this.amisTransferSV.showLoading("", "hrm-contract-detail");
    const param = {
      SubsystemCode: 'AdjustOrganization',
      LayoutConfigID : 1,
      MasterValue: this.employeeID
    };
    this.layoutConfigSV.getLayoutConfig(param).subscribe(res => {
      if (res?.Success && res.Data) {
        const data = res.Data.ListGroupConfig;
        this.listGroupConfigs = GroupConfigUtils.GetData(data);
        this.listDependentData = res.Data.DependentDatas;
        this.listConfigValidates = res.Data.ConfigValidates;
        this.listDependentDictionaries = res.Data.DependentDictionaries;
        this.itemEmployee = this.buildEmployeeMaster(res.Data.MasterData);
        this.buildListGroupConfig();
      }
      else {
        this.amisTransferSV.showErrorToast();
      }
    }, err => {
      this.amisTransferSV.showErrorToast();
    });
  }
  /**
   * build đối tượng truyền lên
   *
   * @param {any} data
   * @memberof PopupAdjustOrganizationUnitComponent
   * vbcong đấy
   */
  buildEmployeeMaster(employee){
    const listFieldName = ['OrganizationUnitID', 'JobPositionID', 'ReportToID', 'SupervisorID'];
    if(this.listEmployee?.length > 0){
      listFieldName.forEach(item => {
        const itemNotExist = this.listEmployee.filter(ite => {
          return ite[item] !== employee[item];
        });
        if(itemNotExist.length > 0){
          employee[item] = null;
          employee[item.replace('ID', 'Name').toString()] = null;
        }
      });
    }
    if(!!employee.OrganizationUnitID && !!employee.JobPositionID){
      this.isDisableSave = false;
    }
    return employee;
  }
  /**
   * build danh sách trường nhập liệu
   *
   * @memberof PopupAdjustOrganizationUnitComponent
   * vbcong tiếp
   */
  buildListGroupConfig(){
    if(this.listGroupConfigs?.length > 0 && this.listGroupConfigs[0].GroupFieldConfigs){
      this.listGroupConfigs[0].GroupFieldConfigs.forEach(item => {
        item.Value = this.itemEmployee[item.FieldName];
        item.ValueText = this.itemEmployee[item.DisplayField];
      });
    }
  }
  /**
   * hàm sau khi validate
   *
   * @param {any} e
   * @memberof PopupAdjustOrganizationUnitComponent
   * vbcong 24/08/2020
   */
  afterValidated(e){
    // this.isSubmit = AmisCommonUtils.cloneData({ IsSubmit: false });
    if(e?.length){
      this.isError = true;
      return;
    }else{
      this.saveAdjustOrga();
    }
  }
  /**
   * hầm nhận thay đổi control field trong nhóm
   *
   * @param {any} e
   * @memberof PopupAdjustOrganizationUnitComponent
   * vbcong
   */
  valueFieldChanged(e){
    if(e){
      if(e.FieldName === 'OrganizationUnitID'){
        this.itemEmployee.OrganizationUnitID = e.Data.Value;
        this.itemEmployee.OrganizationUnitName = e.Data.ValueText;
      }
      if(e.FieldName === 'JobPositionID'){
        this.itemEmployee.JobPositionID = e.Data.Value;
        this.itemEmployee.JobPositionName = e.Data.ValueText;
      }
      if(e.FieldName === 'ReportToID'){
        this.itemEmployee.ReportToID = e.Data.Value;
        this.itemEmployee.ReportToName = e.Data.ValueText;
      }
      if(e.FieldName === 'SupervisorID'){
        this.itemEmployee.SupervisorID = e.Data.Value;
        this.itemEmployee.SupervisorName = e.Data.ValueText;
      }
      if(!!this.itemEmployee.OrganizationUnitID && !!this.itemEmployee.JobPositionID){
        this.isDisableSave = false;
      }
      else{
        this.isDisableSave = true;
      }
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
      this.beforeSave();
    } );
  }

  /**
   * Sự kiện đóng popup
   * nmduy 20/05/2020
   */
  onClosePopup() {
    this.visiblePopup = false;
    this.closePopup.emit();
  }
  /**
   * trước khi luwu
   *
   * @memberof PopupAdjustOrganizationUnitComponent
   */
  beforeSave(){
    this.isSubmit = AmisCommonUtils.cloneData({ IsSubmit: true });
  }

  /**
   * lưu điều chuyển cơ cấu
   * vbcong 20/05/2020
   */
  saveAdjustOrga() {
    const employeeIDs = this.listEmployeeID.join(';');
    this.employeeSV.updateOrgaMultiEmployee(this.itemEmployee, employeeIDs).pipe(takeUntil(this._onDestroySub)).subscribe(res => {
      if (res?.Success && res?.Data) {
        const message = this.translateSV.getValueByKey('SAVE_SUCCESS');
        this.amisTransferSV.showSuccessToast(message);
        this.afftersave.emit(this.itemEmployee);
        this.transferData.onReloadProfileGrid();
      } else if (res?.ValidateInfo?.length) {
        this.amisTransferSV.showErrorToast('Không có quyền hạn');
      } else {
        this.amisTransferSV.showErrorToast();
      }
      this.visiblePopup = false;
      this.onClosePopup();
    });
  }
}
