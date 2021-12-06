import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HrmDiaryEditProfileComponent } from './hrm-diary-edit-profile.component';
import { DxTextBoxModule, DxSelectBoxModule, DxScrollViewModule } from 'devextreme-angular';
import { AmisLoadingModule } from 'src/common/components/amis-loading/amis-loading.module';
import { TranslateModule } from '@ngx-translate/core';
import { AmisIconModule } from 'src/common/components/amis-icon/amis-icon.module';

@NgModule({
  declarations: [HrmDiaryEditProfileComponent],
  imports: [
    CommonModule,
    DxTextBoxModule,
    DxSelectBoxModule,
    DxScrollViewModule,
    AmisLoadingModule,
    TranslateModule,
    AmisIconModule
  ],
  exports: [HrmDiaryEditProfileComponent]
})
export class HrmDiaryEditProfileModule { }
