import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxPopupModule } from 'devextreme-angular';
import { DetailProfilePopupComponent } from './detail-profile-popup.component';
import { AmisButtonModule } from 'src/common/components/amis-button/amis-button.module';
import { AmisPopupModule } from 'src/common/components/amis-popup/amis-popup.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AMISCurrencyModule } from 'src/common/pipes/amis-currency/amis-currency.module';

@NgModule({
  declarations: [DetailProfilePopupComponent],
  imports: [
    CommonModule,
    DxPopupModule,
    AmisButtonModule,
    AmisPopupModule,
    TranslateModule,
    AMISCurrencyModule
  ],
  exports: [
    DetailProfilePopupComponent
  ]
})
export class DetailProfilePopupModule { }
