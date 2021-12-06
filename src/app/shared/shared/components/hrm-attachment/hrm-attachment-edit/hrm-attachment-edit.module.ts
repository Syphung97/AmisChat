import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HrmAttachmentEditComponent } from './hrm-attachment-edit.component';
import { AmisControlPopupModule } from 'src/common/components/amis-control-popup/amis-control-popup.module';
import { AmisFormComponentsModule } from 'src/common/components/amis-form-components/amis-form-components.module';
import { AmisButtonModule } from 'src/common/components/amis-button/amis-button.module';
import { AmisFormFieldModule } from 'src/common/components/amis-form/amis-form-field/amis-form-field.module';
import { TranslateModule } from '@ngx-translate/core';
import { DxScrollViewModule } from 'devextreme-angular';
import { AmisPopupModule } from 'src/common/components/amis-popup/amis-popup.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ShareDirectiveModule } from 'src/app/shared/directive/share-directive/share-directive.module';
import { AmisIconModule } from 'src/common/components/amis-icon/amis-icon.module';


@NgModule({
  declarations: [HrmAttachmentEditComponent],
  imports: [
    CommonModule,
    TranslateModule,
    AmisControlPopupModule,
    AmisFormComponentsModule,
    DxScrollViewModule,
    AmisButtonModule,
    AmisFormFieldModule,
    AmisPopupModule,
    NgbModule,
    ShareDirectiveModule,
    AmisIconModule
  ],
  exports:[HrmAttachmentEditComponent]
})
export class HrmAttachmentEditModule { }
