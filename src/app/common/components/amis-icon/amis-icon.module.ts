import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisIconComponent } from './amis-icon.component';
import { DxPopoverModule } from 'devextreme-angular';



@NgModule({
  declarations: [AmisIconComponent],
  imports: [
    CommonModule,
    DxPopoverModule
  ],
  exports: [
    AmisIconComponent
  ]
})
export class AmisIconModule { }
