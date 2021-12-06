import { Component, OnInit, Input, ViewChild, ViewContainerRef, EventEmitter, Output, Injector } from '@angular/core';
import { ProfileLazyLoadService } from 'src/app/services/lazy-load-modules/profile-lazy-load.service';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { takeUntil } from 'rxjs/operators';
import { BaseFormComponent } from 'src/common/components/base-component-form';
import { FormMode } from 'src/common/enum/form-mode.enum';
import { HRMPermissionUtils } from 'src/app/shared/function/permission-utils';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { SubSystemCode } from 'src/app/shared/constant/sub-system-code/sub-system-code';
import { PermissionCode } from 'src/app/shared/constant/permission-code/permission-code';

@Component({
  selector: 'amis-employee-view-detail',
  templateUrl: './employee-view-detail.component.html',
  styleUrls: ['./employee-view-detail.component.scss']
})
export class EmployeeViewDetailComponent extends BaseFormComponent implements OnInit {

  @ViewChild('formBindingData', { read: ViewContainerRef }) formBindingData: ViewContainerRef;

  visibleForm: boolean = true;

  // Reload lại dữ liệu hay không
  isReload: boolean = false;

  // Giá trị input truyền vào
  param: any;

  // Vị trí hiển thị
  @Input() position: string = "";

  constructor(
    private amisTranslateSV: AmisTranslationService,
    private amisTransferSV: AmisTransferDataService,
    private profileLazyLoadService: ProfileLazyLoadService,
    private readonly injector: Injector) { super(); }

  // Param truyền vào
  @Input() set inputParam(data) {
    if (data) {
      this.param = data;
      setTimeout(() => {
        this.lazyLoadForm(data);
      }, 100);
    }
  };


  ngOnInit(): void {
  }

  /**
  * Hủy bỏ
  * @param {any} event 
  * @memberof AmisLayoutFormGroupViewComponent
  */
  cancel(event) {
    this.afterCancel.emit({
      IsReloadData: this.isReload || event?.IsReloadData,
      ListChangedField: event?.ListChangedField
    });
  }


  /**
   * Đóng form
   * @memberof AmisLayoutFormGroupViewComponent
   */
  closeForm(e) {
    this.afterClose.emit(e);
  }


  /**
   * Xóa 
   * @memberof EmployeeViewDetailComponent
   */
  onDelete(e) {
    this.afterDeleteSuccess.emit(e)
  }

  /**
  * Load form theo phân hệ
  * @param {any} data 
  * @memberof AmisLayoutFormGroupViewComponent
  */
  async lazyLoadForm(data) {

    if (data?.FormMode === FormMode.View) {

      let compFactory = AmisCommonUtils.cloneData(await this.profileLazyLoadService.loadFormViewDetail());
      this.formBindingData?.clear();
      const { instance: componentInstance } = this.formBindingData.createComponent(compFactory, undefined, this.injector);
      componentInstance["inputParam"] = data;
      componentInstance["isTypeInFormGrid"] = true;
      componentInstance["afterCancel"].pipe(takeUntil(componentInstance["_onDestroySub"])).subscribe(this.cancel.bind(this));
      componentInstance["afterDeleteSuccess"].pipe(takeUntil(componentInstance["_onDestroySub"])).subscribe(this.onDelete.bind(this));
      componentInstance["afterChangeFormMode"].pipe(takeUntil(componentInstance["_onDestroySub"])).subscribe(this.changeFormMode.bind(this));

    } else if (data?.FormMode === FormMode.Update) {


      let compFactory = AmisCommonUtils.cloneData(await this.profileLazyLoadService.loadFormEdit());
      this.formBindingData?.clear();
      const { instance: componentInstance } = this.formBindingData.createComponent(compFactory, undefined, this.injector);
      componentInstance["inputParam"] = data;
      componentInstance["isTypeInFormGrid"] = true;
      componentInstance["isDataChanged"] = this.isReload;
      componentInstance["afterCancel"].pipe(takeUntil(componentInstance["_onDestroySub"])).subscribe(this.cancel.bind(this));
      componentInstance["afterDeleteSuccess"].pipe(takeUntil(componentInstance["_onDestroySub"])).subscribe(this.onDelete.bind(this));
      componentInstance["afterSaveSuccess"].pipe(takeUntil(componentInstance["_onDestroySub"])).subscribe(this.saveSuccess.bind(this));
    }
    else if (data?.FormMode === FormMode.Insert) {


      let compFactory = AmisCommonUtils.cloneData(await this.profileLazyLoadService.loadFormInsert());
      this.formBindingData?.clear();
      const { instance: componentInstance } = this.formBindingData.createComponent(compFactory, undefined, this.injector);
      componentInstance["inputParam"] = data;
      componentInstance["isTypeInFormGrid"] = true;
      componentInstance["isUseMasterData"] = true;
      componentInstance["isDataChanged"] = this.isReload;
      componentInstance["afterCancel"].pipe(takeUntil(componentInstance["_onDestroySub"])).subscribe(this.cancel.bind(this));
      componentInstance["afterDeleteSuccess"].pipe(takeUntil(componentInstance["_onDestroySub"])).subscribe(this.onDelete.bind(this));
      componentInstance["afterSaveSuccess"].pipe(takeUntil(componentInstance["_onDestroySub"])).subscribe(this.saveSuccess.bind(this));
    }
  }


  /**
   * Thay đổi form mode
   * @param {any} e 
   * @memberof EmployeeViewDetailComponent
   */
  changeFormMode(e) {
    if (e && this.param) {
      if (e.IsReload) {
        this.isReload = e.IsReload;
      }
      this.param.FormMode = e.FormMode;
      this.param.ListChangedField = e.ListChangedField;
      this.lazyLoadForm(this.param);
    }
  }


  /**
   * Khi lưu thành công
   * @param {any} e 
   * @memberof EmployeeViewDetailComponent
   * created by vhtruong - 05/08/2020
   */
  saveSuccess(e) {
    this.afterSaveSuccess.emit(e);
  }


  /**
   * Kiểm tra quyền của user
   * @memberof EmployeeViewDetailComponent
   */
  checkPermission(subSystemCode, permissonCode) {
    const me = this;
    if (!HRMPermissionUtils.checkPermissionUser(subSystemCode, permissonCode)) {
      me.amisTransferSV.showWarningToast(me.amisTranslateSV.getValueByKey("VALIDATION_NOT_PERMISSION"));
      return false;
    }
    return true;
  }
}
