import { NgModule } from '@angular/core';
import { PopupRemoveUserInAppComponent } from './popup-accept-remove.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DxPopupModule } from 'devextreme-angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AmisButtonModule } from 'src/common/components/amis-button/amis-button.module';

@NgModule({
  declarations: [PopupRemoveUserInAppComponent],
  imports: [
    CommonModule,
    TranslateModule,
    DxPopupModule,
    NgbModule,
    AmisButtonModule
  ],
  exports: [PopupRemoveUserInAppComponent]
})
export class PopupAcceptRemoveModule { }
