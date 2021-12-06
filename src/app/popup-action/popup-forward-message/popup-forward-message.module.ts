import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupForwardMessageComponent } from './popup-forward-message.component';
import { PopupModule } from 'src/app/shared/components/popup/popup.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    PopupForwardMessageComponent
  ],
  imports: [
    CommonModule,
    PopupModule,
    TranslateModule
  ],
  exports: [PopupForwardMessageComponent]
})
export class PopupForwardMessageModule { }
