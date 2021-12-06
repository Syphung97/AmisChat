import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectBoxDropdownComponent } from './select-box-dropdown.component';
import { DxPopoverModule,DxPopupModule, DxScrollViewModule } from 'devextreme-angular';
import { TranslateModule } from '@ngx-translate/core';
import { AmisButtonModule } from 'src/common/components/amis-button/amis-button.module';
import { DetailProfilePopupModule } from 'src/app/shared/components/detail-profile-popup/detail-profile-popup.module';
import { AmisPopupModule } from 'src/common/components/amis-popup/amis-popup.module';
import { ShareDirectiveModule } from 'src/app/shared/directive/share-directive/share-directive.module';

@NgModule({
  declarations: [SelectBoxDropdownComponent],
  imports: [
    CommonModule,
    DxPopoverModule,
    TranslateModule,
    DxPopupModule,
    AmisButtonModule,
    DetailProfilePopupModule,
    AmisPopupModule,
    DxScrollViewModule,
    ShareDirectiveModule
  ],
  exports: [
    SelectBoxDropdownComponent
  ]
})
export class SelectBoxDropdownModule { }
