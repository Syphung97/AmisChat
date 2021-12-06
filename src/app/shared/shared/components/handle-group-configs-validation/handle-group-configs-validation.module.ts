import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HandleGroupConfigsValidationComponent } from './handle-group-configs-validation.component';
import { AmisPopupModule } from 'src/common/components/amis-popup/amis-popup.module';
import { AmisButtonModule } from 'src/common/components/amis-button/amis-button.module';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [HandleGroupConfigsValidationComponent],
  imports: [
    CommonModule,
    AmisPopupModule,
    AmisButtonModule,
    TranslateModule
  ],
  exports: [
    HandleGroupConfigsValidationComponent
  ]
})
export class HandleGroupConfigsValidationModule { }
