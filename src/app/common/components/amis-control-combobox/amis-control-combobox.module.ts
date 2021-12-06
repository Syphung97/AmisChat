import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisControlComboboxComponent } from './amis-control-combobox.component';
import { AmisFormControlModule } from '../amis-form-control/amis-form-control.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DxSelectBoxModule } from 'devextreme-angular';
import { DxLoadPanelModule } from 'devextreme-angular';
import { ShareDirectiveModule } from 'src/app/shared/directive/share-directive/share-directive.module';
import { AmisIconModule } from '../amis-icon/amis-icon.module';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [AmisControlComboboxComponent],
  imports: [
    CommonModule,
    AmisFormControlModule,
    FormsModule,
    DxSelectBoxModule,
    ReactiveFormsModule,
    DxLoadPanelModule,
    ShareDirectiveModule,
    AmisIconModule,
    TranslateModule
  ],
  exports: [AmisControlComboboxComponent],
})
export class AmisControlComboboxModule { }
