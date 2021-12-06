import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupPreviewMultipleAttachmentComponent } from './popup-preview-multiple-attachment.component';
import { TranslateModule } from '@ngx-translate/core';
import { AmisLoadingModule } from 'src/common/components/amis-loading/amis-loading.module';
import { AmisPopupModule } from 'src/common/components/amis-popup/amis-popup.module';
import { AmisButtonModule } from 'src/common/components/amis-button/amis-button.module';


@NgModule({
  declarations: [PopupPreviewMultipleAttachmentComponent],
  imports: [
    CommonModule,
    AmisLoadingModule,
    AmisLoadingModule,
    AmisPopupModule,
    AmisButtonModule,
    TranslateModule
  ],
  exports: [PopupPreviewMultipleAttachmentComponent]
})
export class PopupPreviewMultipleAttachmentModule { }
