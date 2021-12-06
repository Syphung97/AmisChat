import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HrmEmployeeSelfGridComponent } from './hrm-employee-self-grid.component';
import { AmisButtonModule } from 'src/common/components/amis-button/amis-button.module';
import { AmisPagingGridModule } from 'src/common/components/amis-grid/amis-paging-grid/amis-paging-grid.module';
import { AmisPopupModule } from 'src/common/components/amis-popup/amis-popup.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [HrmEmployeeSelfGridComponent],
  imports: [
    CommonModule,
    AmisButtonModule,
    AmisPagingGridModule, 
    AmisPopupModule,
    TranslateModule
  ],
  exports: [HrmEmployeeSelfGridComponent]
})
export class HrmEmployeeSelfGridModule { }
