import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ViewContainerRef, ComponentFactoryResolver, Injector } from '@angular/core';
import { BaseComponent } from 'src/common/components/base-component';
import { takeUntil } from 'rxjs/operators';
import { TypeFormGrid } from 'src/app/shared/enum/form-grid/type-form-grid.enum';
import { FormMode } from 'src/common/enum/form-mode.enum';

@Component({
  selector: 'amis-amis-layout-form-group-view',
  templateUrl: './amis-layout-form-group-view.component.html',
  styleUrls: ['./amis-layout-form-group-view.component.scss']
})
export class AmisLayoutFormGroupViewComponent extends BaseComponent implements OnInit {

  visibleForm: boolean = true;

  @Input() positionFormDataGrid: string = "";

  // Sau khi gọi api lưu thành công
  @Output() afterSaveSuccess: EventEmitter<any> = new EventEmitter();

  // Sau khi hủy bỏ
  @Output() afterCancel: EventEmitter<any> = new EventEmitter();

  // Sau khi ddongs form
  @Output() afterClose: EventEmitter<any> = new EventEmitter();

  // title hiển thị
  @Input() titleForm: string = "";

  // Reload lại dữ liệu
  isReload: boolean = false;

  /**
   * Controller sử dụng để lưu dữ liệu
   * @memberof AmisLayoutFormGroupViewComponent
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
   * @memberof AmisLayoutFormGroupViewComponent
   */
  _subSystemCode: string = "";
  @Input() get subSystemCode() {
    return this._subSystemCode;
  }
  set subSystemCode(val) {
    this._subSystemCode = val;
  }

  // Param truyền vào
  @Input() set inputParam(data) {
    if (data) {
      this.paramInput = data;
      this.typeForm = this.paramInput.TypeForm;
      if (this.paramInput.TypeForm === TypeFormGrid.UseOtherForm) {
        setTimeout(() => {
          this.lazyLoadForm(this.paramInput);
        }, 100);

      } else {

      }
    }
  };

  // Kiểu form - Dùng luông groupfieldconfig hay gọi sang phân hệ khác
  typeForm: TypeFormGrid = TypeFormGrid.UseGroupFieldConfig;

  paramInput: any;

  typeFormGrid: any;

  @ViewChild('formBindingData', { read: ViewContainerRef }) formBindingData: ViewContainerRef;

  // Biến loading
  isLoading: boolean = false;

  constructor(
    private readonly componentFactoryResolver: ComponentFactoryResolver,
    private readonly injector: Injector
  ) {
    super();
    this.typeFormGrid = TypeFormGrid;
  }

  ngOnInit(): void {
  }


  /**
   * Hủy bỏ
   * @param {any} event 
   * @memberof AmisLayoutFormGroupViewComponent
   */
  cancel(event) {
    this.afterCancel.emit({
      IsReloadData: this.isReload || event?.IsReloadData
    });
  }


  /**
   * Đóng form
   * @memberof AmisLayoutFormGroupViewComponent
   */
  closeForm() {
    this.afterClose.emit({
      IsReloadData: this.isReload
    });
  }

  /**
   * Lưu thành công
   * @param {any} event 
   * @memberof AmisLayoutFormGroupViewComponent
   */
  saveSucces(event) {
    this.afterSaveSuccess.emit(event);
  }


  /**
   * Load form theo phân hệ
   * @param {any} data 
   * @memberof AmisLayoutFormGroupViewComponent
   */
  async lazyLoadForm(data) {
    let paramModule = {
      SubSystemCode: this._subSystemCode.toLowerCase(),
      FormMode: data.FormMode,
      SubUrlOfFormMode: this.generateSubUrlModules(data.FormMode),
      SubNameModule: this.generateSubNameModules(data.FormMode)
    }

    const module = await import(`src/app/components/hrm-${paramModule.SubSystemCode}/hrm-${paramModule.SubSystemCode}-${paramModule.SubUrlOfFormMode}/hrm-${paramModule.SubSystemCode}-${paramModule.SubUrlOfFormMode}.module`);
    if (module) {
      this.formBindingData?.clear();
      let moduleInstance = module[`Hrm${this._subSystemCode}${paramModule.SubNameModule}Module`]
      const compFactory = this.componentFactoryResolver.resolveComponentFactory(moduleInstance.components.form);
      const { instance: componentInstance } = this.formBindingData.createComponent(compFactory, undefined, this.injector);
      componentInstance["inputData"] = {
        GroupConfig: data.GroupConfig,
        FormMode: data.FormMode,
        IDValue: data.IDValue,
        MasterIDValue: data.MasterIDValue,
        MasterIDField: data.MasterIDField,
        ObjectID: data.ObjectID,
        DataCloneAndChangeField: data.DataCloneAndChangeField,
        TypeForm: data.TypeForm,
        ObjectData: data.ObjectData,
        PermissionCode: data.PermissionCode,
        PermissionSystemCode: data.PermissionSystemCode,
        IsIgnorePermission: data.IsIgnorePermission,
        IsViewOnly: data.IsViewOnly,
        CallFromEmployeeApp: data.CallFromEmployeeApp
      };
      componentInstance["isTypeInFormGrid"] = true;
      componentInstance["afterCancel"].pipe(takeUntil(componentInstance["_onDestroySub"])).subscribe(this.cancel.bind(this));
      componentInstance["afterSaveSuccess"].pipe(takeUntil(componentInstance["_onDestroySub"])).subscribe(this.saveSucces.bind(this));
      componentInstance["afterClose"].pipe(takeUntil(componentInstance["_onDestroySub"])).subscribe(this.closeForm.bind(this));
      componentInstance["afterChangeFormMode"].pipe(takeUntil(componentInstance["_onDestroySub"])).subscribe(this.changeFormMode.bind(this));
    }
  }


  /**
   * Thay đổi formMode
   * @param {any} e 
   * @memberof AmisLayoutFormGroupViewComponent
   * created by vhtruong - 13/07/2020
   */
  changeFormMode(e) {
    if (e && this.paramInput) {
      if (e.IsReload) {
        this.isReload = e.IsReload;
      }
      this.paramInput.FormMode = e.FormMode;
      this.typeForm = this.paramInput.TypeForm;
      this.lazyLoadForm(this.paramInput);
    }
  }


  /**
   * 
   * @param {any} formMode 
   * @returns {string} 
   * @memberof AmisLayoutFormGroupViewComponent
   */
  generateSubUrlModules(formMode): string {
    if (formMode === FormMode.Insert) {
      return "create";
    } else if (formMode === FormMode.Update) {
      return "edit";
    } else if (formMode === FormMode.View) {
      return "view-detail";
    }
    return "";
  }

  /**
   * 
   * @param {any} formMode 
   * @returns {string} 
   * @memberof AmisLayoutFormGroupViewComponent
   */
  generateSubNameModules(formMode): string {
    if (formMode === FormMode.Insert) {
      return "Create";
    } else if (formMode === FormMode.Update) {
      return "Edit";
    } else if (formMode === FormMode.View) {
      return "ViewDetail";
    }
    return "";
  }

}
