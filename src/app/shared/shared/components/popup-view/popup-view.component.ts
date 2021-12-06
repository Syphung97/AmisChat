import { Component, OnInit, Input, Output, EventEmitter, ViewContainerRef, ViewChild, Injector } from '@angular/core';
import { BaseComponent } from 'src/common/components/base-component';
import { ProfileQueryParamView } from '../../constant/profile/type-profile-param';
import { ProfileLazyLoadService } from 'src/app/services/lazy-load-modules/profile-lazy-load.service';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { type } from 'os';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'amis-popup-view',
  templateUrl: './popup-view.component.html',
  styleUrls: ['./popup-view.component.scss']
})
export class PopupViewComponent extends BaseComponent implements OnInit {

  @ViewChild('formBindingData', { read: ViewContainerRef }) formBindingData: ViewContainerRef;

  visibleForm: boolean = true;

  @Input() positionFormDataGrid: string = "";


  // Sau khi hủy bỏ
  @Output() cancelFromForm: EventEmitter<any> = new EventEmitter();

  // Sau khi ddongs form
  @Output() afterClose: EventEmitter<any> = new EventEmitter();

  constructor(
    private profileLazyLoadService: ProfileLazyLoadService,
    private readonly injector: Injector) { super(); }

  // Param truyền vào
  @Input() set inputParam(data) {
    if (data) {
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
    this.cancelFromForm.emit(event);
  }


  /**
   * Đóng form
   * @memberof AmisLayoutFormGroupViewComponent
   */
  closeForm() {
    this.afterClose.emit();
  }

  /**
  * Load form theo phân hệ
  * @param {any} data 
  * @memberof AmisLayoutFormGroupViewComponent
  */
  async lazyLoadForm(data) {
    let form = data?.Form;
    let compFactory = AmisCommonUtils.cloneData(await this.profileLazyLoadService.loadForm(form));
    this.formBindingData?.clear();
    const { instance: componentInstance } = this.formBindingData.createComponent(compFactory, undefined, this.injector);
    componentInstance["id"] = data?.EmployeeID;
    if (form == ProfileQueryParamView.Detail) {
      componentInstance["isDataChanged"] = data?.IsReloadData;
    }
    componentInstance["onCancelForm"].pipe(takeUntil(componentInstance["_onDestroySub"])).subscribe(this.cancel.bind(this));
  }

}
