import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupUpdateUserMultipleComponent } from './popup-update-user-multiple.component';
import { AmisPopupModule } from 'src/common/components/amis-popup/amis-popup.module';
import { AmisControlGroupModule } from 'src/common/components/amis-control-group/amis-control-group.module';
import { AmisButtonModule } from 'src/common/components/amis-button/amis-button.module';
import { TranslateModule } from '@ngx-translate/core';
import { DxSelectBoxModule } from 'devextreme-angular';
import { AmisControlFieldModule } from '../../../../common/components/amis-control-field/amis-control-field.module';



@NgModule({
  declarations: [PopupUpdateUserMultipleComponent],
  imports: [
    CommonModule,
    AmisPopupModule,
    AmisControlGroupModule,
    TranslateModule,
    AmisButtonModule,
    DxSelectBoxModule,
    AmisControlFieldModule
  ],
  exports: [
    PopupUpdateUserMultipleComponent
  ]
})
export class PopupUpdateUserMultipleModule { }
