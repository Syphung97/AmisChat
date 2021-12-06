import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TypeShowControl } from 'src/common/models/base/typeShow';
import { FormMode } from 'src/common/enum/form-mode.enum';
import { Observable } from 'rxjs';
import { LayoutConfigService } from 'src/app/services/layout-config/layout-config.service';
import { GroupType } from 'src/app/shared/enum/group-config/group-type.enum';
import { GroupConfigUtils } from 'src/app/shared/function/group-control-utils';
import { ButtonColor } from 'src/app/shared/enum/common/button-color.enum';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { AmisDataService } from 'src/common/services/amis-data.service';
import { TransferDataService } from 'src/app/services/base/transfer-data.service';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/common/components/base-component';
import { Employee } from 'src/app/shared/models/employee/employee';
import { JobPositionService } from 'src/app/services/job-position/job-position.service';
import { UserStatus } from 'src/app/shared/enum/users/user-status.enum';
import { UserService } from 'src/app/services/user/user.service';
import { AppTitle } from 'src/app/shared/app-title';
import { Title } from '@angular/platform-browser';
import { HRMPermissionUtils } from '../../function/permission-utils';
import { SubSystemCode } from '../../constant/sub-system-code/sub-system-code';
import { PermissionCode } from '../../constant/permission-code/permission-code';
import { DismissService } from 'src/app/services/dismiss/dismiss.service';
import { AppointService } from 'src/app/services/procedure/appoint.service';
import { TransferService } from 'src/app/services/procedure/transfer.service';
import { TerminationService } from 'src/app/services/procedure/termination.service';

@Component({
  selector: 'amis-popup-procedure-update-employee',
  templateUrl: './popup-procedure-update-employee.component.html',
  styleUrls: ['./popup-procedure-update-employee.component.scss']
})
export class PopupProcedureUpdateEmployeeComponent extends BaseComponent implements OnInit {

  //input config
  @Input() set inputConfig(value) {
    if (value) {
      this.initInputConfig(value)
    }
  };

  //output đóng popup
  @Output() onClosedPopup: EventEmitter<any> = new EventEmitter<any>();

  //output khi chỉnh sửa thành công
  @Output() afterSaveSuccess: EventEmitter<any> = new EventEmitter();

  //output khi cancel form
  @Output() afterCancel: EventEmitter<any> = new EventEmitter();
  // Đối tượng employee cần cập nhật
  employee;
  // Sự kiện từ màn nào
  subSystemCode: string;

  listDependancy = [];
  listDependentData = [];
  listConfigValidates = [];
  // Ẩn hiện popup
  visiblePopup = false;

  //check xem có thay đổi dữ liệu không
  isChangeValue: boolean = false;
  //ẩn hiển popup
  @Input() set visiblePopupInput(value) {
    if (value) {
      this.visiblePopup = value;
    }
  }
  title = this.translateSV.getValueByKey("CONTEXT_MENU_UPDATE_PROFILE");


  height = 476;

  width = 872;

  // Danh sách group config
  listGroupConfigs = [];

  isSubmit = { IsSubmit: false };

  typeShow = new TypeShowControl();

  _formMode = FormMode.Update;

  buttonColor = ButtonColor;

  layoutConfigID;

  isDisplayHeader = true;

  offset = '0 100';
  //đã xóa hồ sơ
  isDeletedEmployee = false;
  isLoading = false;

  procedureID: number;
  constructor(
    private layoutConfig: LayoutConfigService,
    private translateSV: AmisTranslationService,
    private amisTransferSV: AmisTransferDataService,
    private employeeSV: EmployeeService,
    private dataService: AmisDataService,
    private tranferDataSV: TransferDataService,
    private jobPositionService: JobPositionService,
    private userService: UserService,
    private titleSv: Title,
    private appointSV: AppointService,
    private dissmisSV: DismissService,
    private transferSV: TransferService,
    private terminationSV: TerminationService,
  ) {
    super();
    const subTitle = AppTitle.setTitle(
      this.translateSV.getValueByKey('PROCEDURE_TITLE')
    );
    this.titleSv.setTitle(subTitle);
  }

  ngOnInit(): void {
    this.initSubscribe();
    this.setPosition();
  }

  /**
   * Set lại vị trí popup
   *
   * @memberof PopupAdvanceExportComponent
   * created: PTSY 7/8/2020
   */
  setPosition() {
    if (window.innerHeight < 800) {
      this.offset = '0 40'
    }
    else {
      this.offset = '0 100'
    }
  }
  closeALl() {
    this.visibleNotify = false;
    this.visiblePopup = false;
  }

  /**
   * Khởi tạo subscribe
   *
   * @memberof HrmProcedureComponent
   */
  initSubscribe() {
    this.tranferDataSV.onUpdateProfile.pipe(takeUntil(this._onDestroySub)).subscribe(data => {
      this.amisTransferSV.showLoading('');
      this.isSubmit = AmisCommonUtils.cloneData({ IsSubmit: false });
      const employee = data.Data;
      const subSystemCode = data.SubSystem;
      const popupConfig = data.PopupConfig;
      this.width = popupConfig.Width;
      this.height = popupConfig.Height;
      this.title = this.translateSV.getValueByKey("CONTEXT_MENU_UPDATE_PROFILE")
      this.layoutConfigID = popupConfig.LayoutConfigID ? popupConfig.LayoutConfigID : 76;

      this.isDisplayHeader = popupConfig.IsDisplayHeader != null && popupConfig.IsDisplayHeader != undefined ? popupConfig.IsDisplayHeader : true;
      if (employee) {
        this.employee = employee;
        this.title = this.title + " - " + this.employee.EmployeeName;
      }
      this.subSystemCode = subSystemCode;
      this.procedureID = data.Data[this.subSystemCode + "ID"];
      this.getLayoutConfig().subscribe();
      this.visiblePopup = true;
    });
  }

  /**
   * hàm xử lí config popup trong trường hợp truyền input
   * created by: hgvinh 10/08/2020
   */
  initInputConfig(value) {
    const employee = value.Data;
    const subSystemCode = value.SubSystem;
    const popupConfig = value.PopupConfig;
    this.width = popupConfig.Width;
    this.height = popupConfig.Height;
    this.title = this.translateSV.getValueByKey("CONTEXT_MENU_UPDATE_PROFILE")
    this.layoutConfigID = popupConfig.LayoutConfigID ? popupConfig.LayoutConfigID : 76;

    this.isDisplayHeader = popupConfig.IsDisplayHeader != null && popupConfig.IsDisplayHeader != undefined ? popupConfig.IsDisplayHeader : true;
    if (employee) {
      this.employee = employee;
      this.title = this.title + " - " + this.employee.EmployeeName;
    }
    this.subSystemCode = subSystemCode;
    this.procedureID = value.Data[this.subSystemCode + "ID"];
    this.getLayoutConfig().subscribe();
  }

  /**
   * Thực hiện lưu dữ liệu sau khi validate
   *
   * @param {any} event
   * @returns
   * @memberof HrmProcedureComponent
   * PTSY 24/7/2020
   * dtnam1 sửa 15/9/2020 
   */
  afterValidated(event) {
    if (event?.length || !this.isSubmit.IsSubmit) {
      this.amisTransferSV.hideLoading();
      return;
    }
    this.isChangeValue = true;
    const listGroupConfigs = [];
    this.listGroupConfigs.forEach(e => {
      listGroupConfigs.push(...e.GroupFieldConfigs);
    })
    // if(this.subSystemCode == "EmployeeTermination") {

    // }
    // else {

    //   this.listGroupConfigs.forEach(e => {
    //     listGroupConfigs.push(...e.GroupFieldConfigs.filter(e1 => !e1.IsReadOnly));
    //   })
    // }

    this.dataService.updateMultiFieldProcedure("employee", listGroupConfigs).subscribe(res => {
      if (res?.Success) {
        if (this.subSystemCode == SubSystemCode.Termination) {

          // gọi service lấy thông tin của nhân viên. Nếu trạng thái nhân viên là Đang hoạt động thì show cảnh báo hỏi có muốn ngừng kích hoạt không
          this.employeeSV.getByID(this.employee?.EmployeeID).pipe(takeUntil(this._onDestroySub)).subscribe(item => {
            if (item.Success && item.Data) {
              if (item.Data.EmployeeStatusID == 2 && item?.Data?.StatusID == UserStatus.Active) {
                if (!HRMPermissionUtils.checkPermissionUser(SubSystemCode.Profile, PermissionCode.ChangeActiveAccount)) {
                  return;
                }
                this.checkChangeStatusEmployee(item.Data);
              }
            }
          });
        }

        // dtnam1 update trạng thái cập nhật hồ sơ sau khi cập nhật xong

        let procedureSV;
        switch (this.subSystemCode) {
          case SubSystemCode.Appoint:
            procedureSV = this.appointSV;
            break;
          case SubSystemCode.Dismiss:
            procedureSV = this.dissmisSV;
            break;
          case SubSystemCode.Transfer:
            procedureSV = this.transferSV;
            break;
          case SubSystemCode.Termination:
            procedureSV = this.terminationSV;
            break;
        }

        let fieldParam = {
          ModelName: this.subSystemCode,
          FieldKey: this.subSystemCode + "ID",
          ValueKey: this.procedureID,
          FieldNameAndValue: {
            IsUpdatedProfile: true
          }
        }
        procedureSV.updateField(fieldParam).subscribe(res => {
          if (res?.Success) {
            this.tranferDataSV.onReloadProfileGrid();
          }
        });

        this.amisTransferSV.showSuccessToast(this.translateSV.getValueByKey("TOAST_UPDATE_PROFILE_SUCCESS"));

        this.amisTransferSV.hideLoading();
        this.visiblePopup = false;
        this.afterSaveSuccess.emit(true);
      }
      else {
        if (res.ValidateInfo) {

          this.amisTransferSV.hideLoading();
          this.amisTransferSV.showErrorToast(res.ValidateInfo[0]?.ErrorMessage);
        }
        else {
          this.amisTransferSV.hideLoading();
          this.amisTransferSV.showErrorToast();
        }
      }
    }, err => {
      this.amisTransferSV.hideLoading();
      this.amisTransferSV.showErrorToast();
    });


  }
  valueFieldChanged(event) {

  }

  afterUpdateField($event) {

  }

  onClosePopup() {
    this.visiblePopup = false;
    if (!this.isChangeValue) {
      this.afterCancel.emit(true);
    }
    this.isChangeValue = false;
    this.onClosedPopup.emit(false);
  }

  updateProfile() {
    this.isSubmit = AmisCommonUtils.cloneData({ IsSubmit: true });
  }

  /**
  * Hàm lấy dữ liệu layout config bind ra giao diện
  *
  * @memberof HrmSettingDocumentSampleCreateComponent
  * CREATED: PTSY 6/5/2020
  */
  getLayoutConfig(): Observable<any> {
    return new Observable(subscriber => {
      this.layoutConfig.getLayoutConfig({
        "SubsystemCode": this.subSystemCode !== SubSystemCode.Termination ? "EmployeeAppointment" : 'EmployeeTermination',
        "LayoutConfigID": 0,
        "MasterValue": this.employee.EmployeeID ? this.employee.EmployeeID : 0
      }).subscribe(res => {
        if (res?.Success && res.Data) {

          let data = res.Data?.ListGroupConfig;
          this.listDependancy = res.Data?.DependentDictionaries;
          this.listDependentData = res.Data?.DependentDatas;
          this.listConfigValidates = res.Data?.ConfigValidates;
          if (!data[0].GroupFieldConfigs[0].ID) {
            this.isDeletedEmployee = true;
            this.showPopupNotify(this.translateSV.getValueByKey('POPUP_PROCEDURE_UPDATE_NOTIFY_EMPLOYEE_DELETED', { EmployeeName: this.employee.EmployeeName }));

            this.isLoading = false;
          } else {
            this.isDeletedEmployee = false;
            this.isLoading = true;
          }
          this.amisTransferSV.hideLoading();
          this.listGroupConfigs = GroupConfigUtils.GetData(data);

          if (this.subSystemCode == SubSystemCode.Termination) {
            this.setDataForTermination();
          }
          else {
            this.setDataForAppointment();
          }
          subscriber.next(true);
        }
      })
    });

  }

  /**
   * Setdata cho các 3 tab đầu
   *
   * @memberof HrmProcedureComponent
   */
  setDataForAppointment() {
    this.listGroupConfigs[0].GroupFieldConfigs.forEach(e => {
      if (e.FieldName == "OrganizationUnitID") {
        if (this.employee.OrganizationUnitAppointID) {
          e.Value = this.employee.OrganizationUnitAppointID;
          e.ValueText = this.employee.OrganizationUnitAppointName

        }
        else if (this.employee.OrganizationUnitID) {
          e.Value = this.employee.OrganizationUnitID;
          e.ValueText = this.employee.OrganizationUnitName
        }
        else if (this.employee.OrganizationUnitDisplacementID) {
          e.Value = this.employee.OrganizationUnitDisplacementID;
          e.ValueText = this.employee.OrganizationUnitDisplacementName
        }
      }
      if (e.FieldName == "JobPositionID") {
        if (this.employee.JobPositionAppointID) {

          e.Value = this.employee.JobPositionAppointID;
          e.ValueText = this.employee.JobPositionAppointName
          this.getJobPositionData(this.employee.JobPositionAppointID)

        }
        else if (this.employee.JobPositionDisplacementID) {
          e.Value = this.employee.JobPositionDisplacementID;
          e.ValueText = this.employee.JobPositionDisplacementName
          this.getJobPositionData(this.employee.JobPositionDisplacementID)
        }
      }
    });
  }

  /**
   * Lấy dữu liệu lien quan vị trí công việc
   *
   * @param {any} id
   * @memberof HrmProcedureComponent
   */
  getJobPositionData(id) {
    this.jobPositionService.getByID(id).subscribe(data => {
      if (data?.Success) {
        this.listGroupConfigs[0].GroupFieldConfigs.forEach(e => {
          if (e.FieldName == "JobTitleID") {
            e.Value = data.Data.JobTitleID;
            e.ValueText = data.Data.JobTitleName;
          }
          else if (e.FieldName == "JobLevelID") {
            e.Value = data.Data.JobLevelID;
            e.ValueText = data.Data.JobLevelName;
          }
        });
      }
    })
  }

  /**
   * Bind dữ liệu khi ở màn nghỉ việc
   *
   * @memberof HrmProcedureComponent
   * CREATED: PTSY 6/5/2020
   */
  setDataForTermination() {
    this.listGroupConfigs[0].GroupFieldConfigs.forEach(e => {
      if (e.FieldName == "EmployeeStatusID") {
        e.Value = 2;
        e.ValueText = this.translateSV.getValueByKey("FILTER_EMPLOYEE_STATUS_HAS_RETIRED");
      }
      if (e.FieldName == "TerminationReasonID") {
        e.Value = this.employee.TerminationReasonID
        e.ValueText = this.employee.TerminationReasonName
      }
      if (e.FieldName == "TerminationDate") {
        e.Value = this.employee.TerminationDate ? new Date(this.employee.TerminationDate) : null;
      }
      if (e.FieldName == "EmployeeNatureID") {
        e.Value = null;
        e.ValueText = null;
      }
    })
  }


  titleButton: string = "";

  contentNotify = "";

  visibleNotify = false;

  listEmployeeSelect = [];

  isPopupWarning: boolean = false;

  paramRedirect = {};

  cancelPopupNotify() {
    this.visibleNotify = false;
  }

  /**
  * hiện popup thông báo
  * @param message nội dung thông báo
  */
  showPopupNotify(message) {
    this.isPopupWarning = false;
    this.visibleNotify = true;
    this.contentNotify = message;
  }

  /**
   * Xử lý thay đổi trạng thái trên form sửa hồ sơ
   * Created by: dthieu 29-07-2020
   */
  checkChangeStatusEmployee(data) {
    if (data.EmployeeStatusID == 2) { // trạng thái lao động = 2 là nghỉ việc
      // nếu trạng thái tài khoản là đang hoạt động show cảnh báo và thực hiện kích hoạt hồ sơ
      const employeeSelect = data;
      this.listEmployeeSelect = [];
      this.listEmployeeSelect.push(employeeSelect);

      if (data?.StatusID == UserStatus.Active) {// nếu là kích hoạt tài khoản
        this.titleButton = this.translateSV.getValueByKey('DIACTIVE_USER');
        if (this.listEmployeeSelect?.length == 1) {
          this.contentNotify = this.translateSV.getValueByKey("ACTIVE_ACCOUNT_DO_YOU_WANT_DIACTIVE_FOR_SELECT_USER", { Employees: employeeSelect.FullName });
        } else {
          this.contentNotify = this.translateSV.getValueByKey("ACTIVE_ACCOUNT_DO_YOU_WANT_DIACTIVE_FOR_ALL_SELECT_USER");
        }
      }
      this.showPopupNotify(this.contentNotify);
    }
  }


  /**
   * Click kích hoạt trên form cảnh báo
   * Created by: dthieu 28-07-2020
   */
  updateEmployeeProfile() {
    // Chọn 1 bản ghi để kích hoạt
    if (this.listEmployeeSelect?.length == 1) {
      // ngừng kích hoạt 1 tài khoản
      this.userService.deactiveUsers(this.listEmployeeSelect).pipe(takeUntil(this._onDestroySub)).subscribe(res => {
        this.actionAfterActiveSuccess(res);
      })

    }
  }

  /**
   * Xử lý sau khi kích hoạt thành công
   * Created by: dthieu 29-07-2020
   */
  actionAfterActiveSuccess(res) {
    if (res?.Success) {
      this.amisTransferSV.showSuccessToast(this.translateSV.getValueByKey('ACTIVE_ACCOUNT_DIACTIVE_ACCOUNT_SUCCESS'));

      this.cancelPopupNotify();
      this.listEmployeeSelect = [];

    } else {
      this.amisTransferSV.showErrorToast(this.translateSV.getValueByKey('ERROR_HAPPENED'));
    }
  }

}
