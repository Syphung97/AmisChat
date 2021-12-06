import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisControlCheckboxComponent } from './amis-control-checkbox.component';
import { DxCheckBoxModule } from 'devextreme-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AmisFormControlModule } from '../amis-form-control/amis-form-control.module';
import { ShareDirectiveModule } from 'src/app/shared/directive/share-directive/share-directive.module';
import { AmisIconModule } from '../amis-icon/amis-icon.module';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [AmisControlCheckboxComponent],
  imports: [
    CommonModule,
    AmisFormControlModule,
    FormsModule,
    DxCheckBoxModule,
    ReactiveFormsModule,
    ShareDirectiveModule,
    AmisIconModule, TranslateModule
  ],
  exports: [AmisControlCheckboxComponent]
})
export class AmisControlCheckboxModule { }
