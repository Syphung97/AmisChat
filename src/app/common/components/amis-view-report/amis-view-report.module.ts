import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisViewReportComponent } from './amis-view-report.component';
import { AmisReportLayoutModule } from '../amis-report-layout/amis-report-layout.module';
import { AmisButtonModule } from '../amis-button/amis-button.module';
import { DxScrollViewModule } from 'devextreme-angular';
import { TranslateModule } from '@ngx-translate/core';
import { AmisToolbarReportModule } from '../amis-toolbar-report/amis-toolbar-report.module';
import { AmisSidebarReportModule } from '../amis-sidebar-report/amis-sidebar-report.module';
import { AmisReportContentModule } from '../amis-report-content/amis-report-content.module';


@NgModule({
  declarations: [AmisViewReportComponent],
  imports: [
    CommonModule,
    AmisReportLayoutModule,
    AmisButtonModule,
    DxScrollViewModule,
    TranslateModule,
    AmisToolbarReportModule,
    AmisSidebarReportModule,
    AmisReportContentModule
  ],
  exports:[
    AmisViewReportComponent
  ]
})
export class AmisViewReportModule { }
