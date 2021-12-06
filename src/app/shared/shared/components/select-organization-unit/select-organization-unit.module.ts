import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectOrganizationUnitComponent } from './select-organization-unit.component';
import {
  DxDropDownBoxModule,
  DxTreeViewModule
} from 'devextreme-angular';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [SelectOrganizationUnitComponent],
  imports: [
    CommonModule,
    DxDropDownBoxModule,
    DxTreeViewModule,
    TranslateModule
  ],
  exports: [
    SelectOrganizationUnitComponent
  ]
})
export class SelectOrganizationUnitModule { }
