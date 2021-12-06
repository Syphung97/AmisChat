import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisControlTextareaComponent } from './amis-control-textarea.component';
import { DxTextAreaModule } from 'devextreme-angular';
import { AmisFormControlModule } from '../amis-form-control/amis-form-control.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PopupExpandTextAreaModule } from 'src/app/shared/popup/popup-expand-text-area/popup-expand-text-area.module';
import { ShareDirectiveModule } from 'src/app/shared/directive/share-directive/share-directive.module';
import { AmisIconModule } from '../amis-icon/amis-icon.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [AmisControlTextareaComponent],
  imports: [
    CommonModule,
    AmisFormControlModule,
    FormsModule,
    DxTextAreaModule,
    ReactiveFormsModule,
    PopupExpandTextAreaModule,
    ShareDirectiveModule,
    AmisIconModule,
    TranslateModule

  ],
  exports: [AmisControlTextareaComponent]
})
export class AmisControlTextareaModule { }
