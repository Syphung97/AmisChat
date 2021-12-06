import { NgModule } from '@angular/core';
import { PopupAcceptWarningComponent } from './popup-accept-warning.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DxPopupModule } from 'devextreme-angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AmisButtonModule } from 'src/common/components/amis-button/amis-button.module';

@NgModule({
  declarations: [PopupAcceptWarningComponent],
  imports: [
    CommonModule,
    TranslateModule,
    DxPopupModule,
    NgbModule,
    AmisButtonModule
  ],
  exports: [PopupAcceptWarningComponent]
})
export class PopupAcceptWarningModule { }
