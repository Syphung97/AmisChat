import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisReportLayoutComponent } from './amis-report-layout.component';
import { DxScrollViewModule } from 'devextreme-angular';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [AmisReportLayoutComponent],
  imports: [
    CommonModule,
    DxScrollViewModule,
    TranslateModule,
  ],
  exports:[
    AmisReportLayoutComponent
  ]
})
export class AmisReportLayoutModule { }
