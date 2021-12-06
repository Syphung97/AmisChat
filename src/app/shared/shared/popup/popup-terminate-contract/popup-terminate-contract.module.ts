import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DxTextBoxModule, DxSelectBoxModule, DxRadioGroupModule } from 'devextreme-angular'
import { PopupTerminateContractComponent } from './popup-terminate-contract.component';
import { AmisPopupModule } from 'src/common/components/amis-popup/amis-popup.module';
import { BaseModule } from 'src/common/components/base/base.module';
import { AmisButtonModule } from 'src/common/components/amis-button/amis-button.module';
import { AmisControlDateboxModule } from 'src/common/components/amis-control-datebox/amis-control-datebox.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [PopupTerminateContractComponent],
  imports: [
    CommonModule,
    AmisPopupModule,
    TranslateModule,
    BaseModule,
    AmisButtonModule,
    DxRadioGroupModule,
    AmisControlDateboxModule,
    FormsModule
  ],
  exports:[
    PopupTerminateContractComponent
  ]
})
export class PopupTerminateContractModule { }
