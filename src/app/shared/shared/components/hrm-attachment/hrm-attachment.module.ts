import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HrmAttachmentComponent } from './hrm-attachment.component';
import { AmisButtonModule } from 'src/common/components/amis-button/amis-button.module';
import { AmisFormGridModule } from 'src/common/components/amis-form/amis-form-grid/amis-form-grid.module';
import { TranslateModule } from '@ngx-translate/core';
import { AmisPagingGridModule } from 'src/common/components/amis-grid/amis-paging-grid/amis-paging-grid.module';
import { AmisPopupModule } from 'src/common/components/amis-popup/amis-popup.module';
import { HrmAttachmentEditModule } from './hrm-attachment-edit/hrm-attachment-edit.module';
import { ShareDirectiveModule } from '../../directive/share-directive/share-directive.module';

@NgModule({
  declarations: [HrmAttachmentComponent],
  imports: [
    CommonModule,
    AmisButtonModule,
    AmisFormGridModule,
    TranslateModule,
    AmisPagingGridModule,
    AmisPopupModule,
    HrmAttachmentEditModule,
    ShareDirectiveModule
  ],
  exports:[HrmAttachmentComponent]
})
export class HrmAttachmentModule { }
