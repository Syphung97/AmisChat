import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupActiveEmployeeAccountComponent } from './popup-active-employee-account.component';
import { TranslateModule } from '@ngx-translate/core';
import { AmisButtonModule } from 'src/common/components/amis-button/amis-button.module';
import { AmisPopupModule } from 'src/common/components/amis-popup/amis-popup.module';
import { DxPopoverModule, DxTextBoxModule } from 'devextreme-angular';
import { AmisControlTextboxModule } from 'src/common/components/amis-control-textbox/amis-control-textbox.module';
import { FormsModule } from '@angular/forms';
import { DxScrollViewModule } from 'devextreme-angular';
import { AmisFormFieldModule } from 'src/common/components/amis-form/amis-form-field/amis-form-field.module';
import { AmisFormComponentsModule } from 'src/common/components/amis-form-components/amis-form-components.module';


@NgModule({
  declarations: [PopupActiveEmployeeAccountComponent],
  imports: [
    CommonModule,
    TranslateModule,
    AmisButtonModule,
    AmisPopupModule,
    DxPopoverModule,
    DxTextBoxModule,
    AmisControlTextboxModule,
    FormsModule,
    DxScrollViewModule,
    AmisFormComponentsModule,
    AmisFormFieldModule,
  ],
  exports: [
    PopupActiveEmployeeAccountComponent
  ]
})
export class PopupActiveEmployeeAccountModule { }
