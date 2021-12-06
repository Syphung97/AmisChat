import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ViewContainerRef, ComponentFactoryResolver, Injector } from '@angular/core';
import { TypeFormGrid } from 'src/app/shared/enum/form-grid/type-form-grid.enum';
import { takeUntil } from 'rxjs/operators';
import { FormMode } from 'src/common/enum/form-mode.enum';
import { BaseFormComponent } from 'src/common/components/base-component-form';
import { ProcedureType } from 'src/app/shared/enum/procedure/procedure-type';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'amis-procedure-view-detail',
  templateUrl: './procedure-view-detail.component.html',
  styleUrls: ['./procedure-view-detail.component.scss']
})
export class ProcedureViewDetailComponent extends BaseFormComponent implements OnInit {

  visibleForm: boolean = true;

  @Input() position: string = "";

  // title hiển thị
  @Input() titleForm: string = "";

  // Reload lại dữ liệu
  isReload: boolean = false;

  // Param truyền vào
  @Input() set inputParam(data) {
    if (data) {
      this.paramInput = data;
      setTimeout(() => {
        this.lazyLoadForm(this.paramInput);
      }, 100);
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
   * Created by: dtnam1 - 13/07/2020
   */
  cancel(event) {
    this.isReload = this.isReload || event?.IsReload;
    this.afterCancel.emit({
      IsReload: this.isReload || event?.IsReload
    });
  }


  /**
   * Đóng form
   * @memberof AmisLayoutFormGroupViewComponent
   */
  closeForm(event) {
    this.afterClose.emit({
      IsReload: this.isReload || event?.IsReload
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
   * Created by: dtnam1 - 13/07/2020
   */
  async lazyLoadForm(data) {
    var module: any;
    var moduleInstance: any;
    let subUrlOfFormMode = this.generateSubUrlModules(data.FormMode);
    let subNameModule = this.generateSubNameModules(data.FormMode);
    switch (data.ModuleID) {
      case ProcedureType.Appoint:
        module = await import(`src/app/components/hrm-procedure/hrm-procedure-appointed/hrm-appoint-${subUrlOfFormMode}/hrm-appoint-${subUrlOfFormMode}.module`);
        if (module) {
          moduleInstance = module[`HrmAppoint${subNameModule}Module`];
        }
        break;
      case ProcedureType.Dismiss:
        module = await import(`src/app/components/hrm-procedure/hrm-procedure-dismiss/hrm-procedure-dismiss-${subUrlOfFormMode}/hrm-procedure-dismiss-${subUrlOfFormMode}.module`);
        if (module) {
          moduleInstance = module[`HrmProcedureDismiss${subNameModule}Module`];
        }
        break;
      case ProcedureType.Transfer:
        module = await import(`src/app/components/hrm-procedure/hrm-procedure-transfer/hrm-transfer-${subUrlOfFormMode}/hrm-transfer-${subUrlOfFormMode}.module`);
        if (module) {
          moduleInstance = module[`HrmTransfer${subNameModule}Module`];
        }
        break;
      case ProcedureType.Termination:
        module = await import(`src/app/components/hrm-procedure/hrm-procedure-termination/hrm-termination-${subUrlOfFormMode}/hrm-termination-${subUrlOfFormMode}.module`);
        if (module) {
          moduleInstance = module[`HrmTermination${subNameModule}Module`];
        }
        break;
    }

    if (moduleInstance) {
      this.formBindingData?.clear();
      const compFactory = this.componentFactoryResolver.resolveComponentFactory(moduleInstance.components.form);
      const { instance: componentInstance } = this.formBindingData.createComponent(compFactory, undefined, this.injector);
      componentInstance["inputData"] = {
        FormMode: data.FormMode,
        ObjectID: data.ObjectID,
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
   * created by dtnam1 - 13/07/2020
   */
  changeFormMode(e) {
    if (e && this.paramInput) {
      if (e.IsReload) {
        this.isReload = e.IsReload;
      }
      this.paramInput.FormMode = e.FormMode;
      this.paramInput.IsReload = this.isReload;
      // this.typeForm = this.paramInput.TypeForm;
      this.lazyLoadForm(this.paramInput);
    }
  }


  /**
   * 
   * @param {any} formMode 
   * @returns {string} 
   * @memberof AmisLayoutFormGroupViewComponent
   * Created by: dtnam1 - 13/07/2020
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
   * Created by: dtnam1 - 13/07/2020
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
