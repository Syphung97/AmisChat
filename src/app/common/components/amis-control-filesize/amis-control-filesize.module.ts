import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisControlFileSizeComponent } from './amis-control-filesize.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AmisFormControlModule } from '../amis-form-control/amis-form-control.module';
import { AMISCurrencyModule } from 'src/common/pipes/amis-currency/amis-currency.module';
import { DxNumberBoxModule } from 'devextreme-angular';
import { ShareDirectiveModule } from 'src/app/shared/directive/share-directive/share-directive.module';
import { AmisIconModule } from '../amis-icon/amis-icon.module';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [AmisControlFileSizeComponent],
  imports: [
    CommonModule,
    AmisFormControlModule,
    FormsModule,
    ReactiveFormsModule,
    AMISCurrencyModule,
    DxNumberBoxModule,
    ShareDirectiveModule,
    AmisIconModule,
    TranslateModule
  ],
  exports: [AmisControlFileSizeComponent]
})
export class AmisControlFileSizeModule { }
