import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AmisButtonModule } from 'src/common/components/amis-button/amis-button.module';
import { PopupEditDocumentSampleComponent } from './popup-edit-document-sample.component';
import { AmisPopupModule } from 'src/common/components/amis-popup/amis-popup.module';
import { AmisControlFormGroupModule } from 'src/common/components/amis-control-form-group/amis-control-form-group.module';



@NgModule({
  declarations: [PopupEditDocumentSampleComponent],
  imports: [
    CommonModule,
    AmisButtonModule,
    AmisPopupModule,
    TranslateModule,
    AmisControlFormGroupModule
  ],
  exports:[
    PopupEditDocumentSampleComponent
  ]
})
export class PopupEditDocumentSampleModule { 
  static components = {
    viewForm: PopupEditDocumentSampleComponent
  };
}
