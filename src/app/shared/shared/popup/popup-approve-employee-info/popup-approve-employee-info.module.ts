import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupApproveEmployeeInfoComponent } from './popup-approve-employee-info.component';
import { AmisPopupModule } from 'src/common/components/amis-popup/amis-popup.module';
import { AmisControlFormGroupModule } from 'src/common/components/amis-control-form-group/amis-control-form-group.module';



@NgModule({
  declarations: [PopupApproveEmployeeInfoComponent],
  imports: [
    CommonModule,
    AmisPopupModule,
    AmisControlFormGroupModule
  ]
})
export class PopupApproveEmployeeInfoModule { }
