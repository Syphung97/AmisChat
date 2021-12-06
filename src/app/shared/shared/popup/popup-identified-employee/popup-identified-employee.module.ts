import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupIdentifiedEmployeeComponent } from './popup-identified-employee.component';
import { AmisPopupModule } from 'src/common/components/amis-popup/amis-popup.module';
import { AmisButtonModule } from 'src/common/components/amis-button/amis-button.module';
import { TranslateModule } from '@ngx-translate/core';
import { AmisUploadDirectiveModule } from 'src/common/directive/upload-directive/upload-directive.module';
import { HrmProfileCreateModule } from 'src/app/components/hrm-profile/hrm-profile-create/hrm-profile-create.module';


@NgModule({
  declarations: [PopupIdentifiedEmployeeComponent],
  imports: [
    CommonModule,
    AmisPopupModule,
    AmisButtonModule,
    TranslateModule,
    AmisUploadDirectiveModule,
    HrmProfileCreateModule
  ],
  exports: [PopupIdentifiedEmployeeComponent]
})
export class PopupIdentifiedEmployeeModule { }
