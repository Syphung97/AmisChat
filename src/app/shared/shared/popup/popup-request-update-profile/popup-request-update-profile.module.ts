import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupRequestUpdateProfileComponent } from './popup-request-update-profile.component';
import { AmisPopupModule } from 'src/common/components/amis-popup/amis-popup.module';
import { AmisButtonModule } from 'src/common/components/amis-button/amis-button.module';
import { TranslateModule } from '@ngx-translate/core';
import { AmisControlFieldModule } from 'src/common/components/amis-control-field/amis-control-field.module';
import { AmisControlFormGroupModule } from 'src/common/components/amis-control-form-group/amis-control-form-group.module';

@NgModule({
  declarations: [PopupRequestUpdateProfileComponent],
  imports: [
    CommonModule,
    AmisPopupModule,
    AmisButtonModule,
    TranslateModule,
    AmisControlFieldModule,
    AmisControlFormGroupModule
  ],
  exports: [PopupRequestUpdateProfileComponent]
})
export class PopupRequestUpdateProfileModule { }
