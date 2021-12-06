import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupBaseAddDataComponent } from './popup-base-add-data.component';
import { AmisPopupModule } from 'src/common/components/amis-popup/amis-popup.module';
import { AmisButtonModule } from 'src/common/components/amis-button/amis-button.module';
import { TranslateModule } from '@ngx-translate/core';
import { AmisFormFieldModule } from 'src/common/components/amis-form/amis-form-field/amis-form-field.module';



@NgModule({
  declarations: [PopupBaseAddDataComponent],
  imports: [
    CommonModule,
    AmisPopupModule,

    AmisButtonModule,
    TranslateModule,
    AmisFormFieldModule
  ],
  exports: [
    PopupBaseAddDataComponent
  ]
})
export class PopupBaseAddDataModule { }
