import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisPopoverSelectComponent } from './amis-popover-select.component';
import { DxPopoverModule, DxScrollViewModule } from 'devextreme-angular';



@NgModule({
  declarations: [AmisPopoverSelectComponent],
  imports: [
    CommonModule,
    DxPopoverModule,
    DxScrollViewModule
  ],
  exports: [AmisPopoverSelectComponent]
})
export class AmisPopoverSelectModule { }
