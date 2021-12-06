import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupViewDocumentComponent } from './popup-view-document.component';

import { TranslateModule } from '@ngx-translate/core';


import { AmisLoadingModule } from 'src/common/components/amis-loading/amis-loading.module';
import { AmisPopupModule } from 'src/common/components/amis-popup/amis-popup.module';
import { AmisButtonModule } from 'src/common/components/amis-button/amis-button.module';



@NgModule({
  declarations: [PopupViewDocumentComponent],
  imports: [
    CommonModule,

    TranslateModule,

    AmisLoadingModule,
    AmisLoadingModule,
    AmisPopupModule,
    AmisButtonModule,
  ],
  exports: [PopupViewDocumentComponent]
})
export class PopupViewDocumentModule { }
