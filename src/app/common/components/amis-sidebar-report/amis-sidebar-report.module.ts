import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisSidebarReportComponent } from './amis-sidebar-report.component';
import { AmisButtonModule } from '../amis-button/amis-button.module';
import { DxScrollViewModule } from 'devextreme-angular';
import { TranslateModule } from '@ngx-translate/core';
import { AmisControlDateboxModule } from '../amis-control-datebox/amis-control-datebox.module';
import { AmisControlComboboxModule } from '../amis-control-combobox/amis-control-combobox.module';
import { AmisControlTagboxModule } from '../amis-control-tagbox/amis-control-tagbox.module';
import { AmisControlTreeBoxModule } from '../amis-control-treebox/amis-control-treebox.module';
import { AmisControlFieldModule } from '../amis-control-field/amis-control-field.module';
import { SelectOrganizationUnitModule } from 'src/app/shared/components/select-organization-unit/select-organization-unit.module';
import { AmisDateRangeModule } from '../amis-date-range/amis-date-range.module';
import { AmisControlTextboxModule } from '../amis-control-textbox/amis-control-textbox.module';
import { FormsModule } from '@angular/forms';
import { AmisControlNumberboxModule } from '../amis-control-numberbox/amis-control-numberbox.module';
import { DxNumberBoxModule } from 'devextreme-angular';
import { AmisIconModule } from '../amis-icon/amis-icon.module';

@NgModule({
  declarations: [AmisSidebarReportComponent],
  imports: [
    CommonModule,
    AmisButtonModule,
    DxScrollViewModule,
    TranslateModule,
    AmisControlDateboxModule,
    AmisControlComboboxModule,
    AmisControlTagboxModule,
    AmisControlTreeBoxModule,
    AmisControlFieldModule,
    SelectOrganizationUnitModule,
    AmisDateRangeModule,
    AmisControlTextboxModule,
    FormsModule,
    AmisControlNumberboxModule,
    DxNumberBoxModule,
    AmisIconModule
  ],
  exports:[
    AmisSidebarReportComponent
  ]
})
export class AmisSidebarReportModule { }
