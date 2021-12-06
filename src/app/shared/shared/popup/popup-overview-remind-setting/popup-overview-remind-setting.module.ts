import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupOverviewRemindSettingComponent } from './popup-overview-remind-setting.component';
import { AmisPopupModule } from 'src/common/components/amis-popup/amis-popup.module';
import { AmisButtonModule } from 'src/common/components/amis-button/amis-button.module';
import { TranslateModule } from '@ngx-translate/core';
import { DxCheckBoxModule } from 'devextreme-angular';
import { DxNumberBoxModule } from 'devextreme-angular';
import { AmisLoadingModule } from 'src/common/components/amis-loading/amis-loading.module';


@NgModule({
  declarations: [PopupOverviewRemindSettingComponent],
  imports: [
    CommonModule,
    AmisPopupModule,
    AmisButtonModule,
    TranslateModule,
    AmisLoadingModule,
    DxCheckBoxModule,
    DxNumberBoxModule
  ],
  exports: [
    PopupOverviewRemindSettingComponent
  ]
})
export class PopupOverviewRemindSettingModule { }
