import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ViewContainerRef, ComponentFactoryResolver, Injector } from '@angular/core';
import { TypeFormGrid } from 'src/app/shared/enum/form-grid/type-form-grid.enum';
import { takeUntil } from 'rxjs/operators';
import { FormMode } from 'src/common/enum/form-mode.enum';
import { BaseFormComponent } from 'src/common/components/base-component-form';

@Component({
  selector: 'amis-contract-view-detail',
  templateUrl: './contract-view-detail.component.html',
  styleUrls: ['./contract-view-detail.component.scss']
})
export class ContractViewDetailComponent extends BaseFormComponent implements OnInit {

  visibleForm: boolean = true;

  @Input() position: string = "";

  // title hiển thị
  @Input() titleForm: string = "";

  // Reload lại dữ liệu
  isReload: boolean = false;

  isTypeInFormGrid = true;

  // Param truyền vào
  @Input() set inputParam(data) {
    if (data) {
      this.paramInput = data;
      if (data.FromLayout) {
        this.isTypeInFormGrid = false;
      }
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

  @Input() isShowSubMenu: boolean = true;

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
  closeForm(event) {
    this.afterClose.emit({
      IsReloadData: this.isReload || event?.IsReloadData
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

  deleteSuccess(event){
    this.afterDeleteSuccess.emit(event);
  }


  /**
   * Load form theo phân hệ
   * @param {any} data 
   * @memberof AmisLayoutFormGroupViewComponent
   */
  async lazyLoadForm(data) {
    let paramModule = {
      SubUrlOfFormMode: this.generateSubUrlModules(data.FormMode),
      SubNameModule: this.generateSubNameModules(data.FormMode)
    }

    const module = await import(`src/app/components/hrm-contract/hrm-contract-${paramModule.SubUrlOfFormMode}/hrm-contract-${paramModule.SubUrlOfFormMode}.module`);
    if (module) {
      this.formBindingData?.clear();
      let moduleInstance = module[`HrmContract${paramModule.SubNameModule}Module`]
      const compFactory = this.componentFactoryResolver.resolveComponentFactory(moduleInstance.components.form);
      const { instance: componentInstance } = this.formBindingData.createComponent(compFactory, undefined, this.injector);
      componentInstance["inputData"] = {
        FormMode: data.FormMode,
        ObjectID: data.ObjectID,
      };
      componentInstance["isTypeInFormGrid"] = this.isTypeInFormGrid;
      componentInstance["afterCancel"].pipe(takeUntil(componentInstance["_onDestroySub"])).subscribe(this.cancel.bind(this));
      componentInstance["afterSaveSuccess"].pipe(takeUntil(componentInstance["_onDestroySub"])).subscribe(this.saveSucces.bind(this));
      componentInstance["afterClose"].pipe(takeUntil(componentInstance["_onDestroySub"])).subscribe(this.closeForm.bind(this));
      componentInstance["afterChangeFormMode"].pipe(takeUntil(componentInstance["_onDestroySub"])).subscribe(this.changeFormMode.bind(this));
      componentInstance["afterDeleteSuccess"].pipe(takeUntil(componentInstance["_onDestroySub"])).subscribe(this.deleteSuccess.bind(this));
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
      if(e.IsReload){
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
