import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisDoughnutCharComponent } from './amis-doughnut-char.component';
import { DxPieChartModule, DxScrollViewModule } from 'devextreme-angular';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [AmisDoughnutCharComponent],
  imports: [
    CommonModule,
    DxPieChartModule,
    DxScrollViewModule,
    TranslateModule
  ],
  exports:[AmisDoughnutCharComponent]
})
export class AmisDoughnutCharModule { }
