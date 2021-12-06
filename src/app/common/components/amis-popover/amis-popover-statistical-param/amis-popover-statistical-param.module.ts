import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisPopoverStatisticalParamComponent } from './amis-popover-statistical-param.component';
import { TranslateModule } from '@ngx-translate/core';
import { SelectOrganizationUnitModule } from 'src/app/shared/components/select-organization-unit/select-organization-unit.module';
import { AmisControlComboboxModule } from '../../amis-control-combobox/amis-control-combobox.module';
import { AmisControlNumberboxModule } from '../../amis-control-numberbox/amis-control-numberbox.module';
import { AmisButtonModule } from '../../amis-button/amis-button.module';
import { FormsModule } from '@angular/forms';
import { AmisControlDateboxModule } from '../../amis-control-datebox/amis-control-datebox.module';
import { AmisPopoverModule } from '../amis-popover-base/amis-popover-base.module';
import { DxNumberBoxModule } from 'devextreme-angular';


@NgModule({
  declarations: [AmisPopoverStatisticalParamComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    AmisPopoverModule,
    SelectOrganizationUnitModule,
    AmisControlComboboxModule,
    AmisControlNumberboxModule,
    AmisButtonModule,
    AmisControlDateboxModule,
    DxNumberBoxModule
  ],
  exports: [AmisPopoverStatisticalParamComponent]
})
export class AmisPopoverStatisticalParamModule { }
