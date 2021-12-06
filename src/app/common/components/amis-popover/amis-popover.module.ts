import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from '@ngx-translate/core';
import { DxPopoverModule, DxScrollViewModule, DxNumberBoxModule } from "devextreme-angular";
import { AmisPopoverBaseComponent } from './amis-popover-base/amis-popover-base.component';
import { AmisButtonModule } from '../amis-button/amis-button.module';
import { SelectOrganizationUnitModule } from 'src/app/shared/components/select-organization-unit/select-organization-unit.module';
import { AmisPopoverStatisticalParamComponent } from './amis-popover-statistical-param/amis-popover-statistical-param.component';
import { AmisControlComboboxModule } from '../amis-control-combobox/amis-control-combobox.module';
import { AmisControlNumberboxModule } from '../amis-control-numberbox/amis-control-numberbox.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AmisPopoverBaseComponent, AmisPopoverStatisticalParamComponent],
  imports: [
    CommonModule,
    DxPopoverModule,
    DxScrollViewModule,
    AmisButtonModule,
    TranslateModule,
    SelectOrganizationUnitModule,
    AmisControlComboboxModule,
    AmisControlNumberboxModule,
    FormsModule,
    DxNumberBoxModule
  ],
  exports: [AmisPopoverBaseComponent, AmisPopoverStatisticalParamComponent]
})
export class AmisPopoverModule { }
