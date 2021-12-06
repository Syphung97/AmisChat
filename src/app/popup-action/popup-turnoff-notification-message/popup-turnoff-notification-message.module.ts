import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupTurnoffNotificationMessageComponent } from './popup-turnoff-notification-message.component';
import { PopupModule } from 'src/app/shared/components/popup/popup.module';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PopupTurnoffNotificationMessageComponent
  ],
  imports: [
    CommonModule,
    PopupModule,
    NzRadioModule,
    FormsModule
  ],
  exports: [PopupTurnoffNotificationMessageComponent]
})
export class PopupTurnoffNotificationMessageModule { }
