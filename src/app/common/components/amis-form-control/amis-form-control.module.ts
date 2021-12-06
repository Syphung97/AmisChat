import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisFormControlComponent } from './amis-form-control.component';
import { DxPopoverModule } from 'devextreme-angular';



@NgModule({
  declarations: [AmisFormControlComponent],
  imports: [
    CommonModule,
    DxPopoverModule
  ],
  exports: [AmisFormControlComponent]
})
export class AmisFormControlModule { }
