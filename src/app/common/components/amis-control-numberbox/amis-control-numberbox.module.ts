import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisControlNumberboxComponent } from './amis-control-numberbox.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AmisFormControlModule } from '../amis-form-control/amis-form-control.module';
import { DxNumberBoxModule } from 'devextreme-angular';
import { AMISCurrencyModule } from 'src/common/pipes/amis-currency/amis-currency.module';
import { ShareDirectiveModule } from 'src/app/shared/directive/share-directive/share-directive.module';
import { AmisIconModule } from '../amis-icon/amis-icon.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [AmisControlNumberboxComponent],
  imports: [
    CommonModule,
    AmisFormControlModule,
    FormsModule,
    DxNumberBoxModule,
    ReactiveFormsModule,
    AMISCurrencyModule,
    ShareDirectiveModule,
    AmisIconModule,
    TranslateModule
  ],
  exports: [AmisControlNumberboxComponent]
})
export class AmisControlNumberboxModule { }
