import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupSendMailComponent } from './popup-send-mail.component';
import { AmisPopupModule } from 'src/common/components/amis-popup/amis-popup.module';
import { DxTextBoxModule, DxPopupModule, DxScrollViewModule, DxSelectBoxModule, DxTagBoxModule, DxPopoverModule} from 'devextreme-angular';
import { TranslateModule } from '@ngx-translate/core';
import { AmisCkeditorModule } from 'src/common/components/amis-ckeditor/amis-ckeditor.module';
import { AmisButtonModule } from 'src/common/components/amis-button/amis-button.module';
import { FormsModule } from '@angular/forms';
import { AmisControlComboboxModule } from 'src/common/components/amis-control-combobox/amis-control-combobox.module';
import { AmisControlHumanTagboxModule } from 'src/common/components/amis-control-human-tagbox/amis-control-human-tagbox.module';
import { PopupCreateDocumentModule } from '../popup-create-document/popup-create-document.module';
import { AmisControlUploadFileModule } from 'src/common/components/amis-control-upload-file/amis-control-upload-file.module';
import { HrmSettingDocumentSampleCreateModule } from 'src/app/components/hrm-setting/category/hrm-setting-document-sample/hrm-setting-document-sample-create/hrm-setting-document-sample-create.module';

@NgModule({
  declarations: [PopupSendMailComponent],
  imports: [
    CommonModule,
    AmisPopupModule,
    TranslateModule,
    DxTextBoxModule,
    AmisCkeditorModule,
    DxPopupModule,
    DxScrollViewModule,
    DxSelectBoxModule,
    AmisButtonModule,
    FormsModule,
    DxTagBoxModule,
    AmisControlComboboxModule,
    AmisControlHumanTagboxModule,
    PopupCreateDocumentModule,
    AmisControlUploadFileModule,
    HrmSettingDocumentSampleCreateModule,
    DxPopoverModule
  ],
  exports: [PopupSendMailComponent]
})
export class PopupSendMailModule { }
