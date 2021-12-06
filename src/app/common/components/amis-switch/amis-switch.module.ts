import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisSwitchComponent } from './amis-switch.component';
import { DxScrollViewModule, DxPopoverModule, DxTextBoxModule } from 'devextreme-angular';
import { AmisButtonModule } from '../amis-button/amis-button.module';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [AmisSwitchComponent],
  imports: [
    CommonModule,
    DxScrollViewModule,
    AmisButtonModule,
    DxPopoverModule,
    DxTextBoxModule,
    FormsModule,
    TranslateModule
  ],
  exports:[AmisSwitchComponent]
})
export class AmisSwitchModule { }
