import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeViewDetailComponent } from './employee-view-detail.component';
import { AmisControlPopupModule } from 'src/common/components/amis-control-popup/amis-control-popup.module';



@NgModule({
  declarations: [EmployeeViewDetailComponent],
  imports: [
    CommonModule,
    AmisControlPopupModule
  ],
  exports: [EmployeeViewDetailComponent]
})
export class EmployeeViewDetailModule { }
