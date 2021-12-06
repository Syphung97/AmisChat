import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseModule } from '../base/base.module';
import { AmisControlUploadFileComponent } from './amis-control-upload-file.component';
import { AmisFormControlModule } from 'src/common/components/amis-form-control/amis-form-control.module';
import { AmisTextboxModule } from 'src/common/components/amis-textbox/amis-textbox.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShareDirectiveModule } from 'src/app/shared/directive/share-directive/share-directive.module';
import { AmisIconModule } from '../amis-icon/amis-icon.module';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [AmisControlUploadFileComponent],
  imports: [
    CommonModule,
    BaseModule,
    AmisFormControlModule,
    AmisTextboxModule,
    FormsModule,
    ReactiveFormsModule,
    ShareDirectiveModule,
    AmisIconModule,
    TranslateModule
  ],
  exports: [AmisControlUploadFileComponent]
})
export class AmisControlUploadFileModule {
}

