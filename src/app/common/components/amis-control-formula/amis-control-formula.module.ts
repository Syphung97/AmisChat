import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisControlFormulaComponent } from './amis-control-formula.component';
import { AmisFormControlModule } from '../amis-form-control/amis-form-control.module';
import { FormsModule } from '@angular/forms';
import { AmisPopupModule } from '../amis-popup/amis-popup.module';
import { AmisButtonModule } from '../amis-button/amis-button.module';
import { AmisControlTextareaModule } from '../amis-control-textarea/amis-control-textarea.module';
import { DxScrollViewModule } from 'devextreme-angular';
import { ShareDirectiveModule } from 'src/app/shared/directive/share-directive/share-directive.module';
import { AmisIconModule } from '../amis-icon/amis-icon.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [AmisControlFormulaComponent],
  imports: [
    CommonModule,
    AmisFormControlModule,
    FormsModule,
    AmisPopupModule,
    AmisButtonModule,
    AmisControlTextareaModule,
    DxScrollViewModule,
    ShareDirectiveModule,
    AmisIconModule,
    TranslateModule
  ],
  exports: [AmisControlFormulaComponent]
})
export class AmisControlFormulaModule { }
