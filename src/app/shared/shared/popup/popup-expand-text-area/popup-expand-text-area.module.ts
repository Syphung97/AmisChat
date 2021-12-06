import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupExpandTextAreaComponent } from './popup-expand-text-area.component';
import { AmisPopupModule } from 'src/common/components/amis-popup/amis-popup.module';
import { AmisButtonModule } from 'src/common/components/amis-button/amis-button.module';
import { TranslateModule } from '@ngx-translate/core';
import { DxTextAreaModule } from 'devextreme-angular';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [PopupExpandTextAreaComponent],
  imports: [
    CommonModule,
    AmisPopupModule,
    AmisButtonModule,
    TranslateModule,
    DxTextAreaModule,
    FormsModule
  ],
  exports: [
    PopupExpandTextAreaComponent
  ]
})
export class PopupExpandTextAreaModule { }
