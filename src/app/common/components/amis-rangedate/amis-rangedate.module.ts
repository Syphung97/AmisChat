import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisRangedateComponent } from './amis-rangedate.component';
import { DxPopupModule, DxCalendarModule } from "devextreme-angular";



@NgModule({
  declarations: [AmisRangedateComponent],
  imports: [
    CommonModule, DxPopupModule, DxCalendarModule
  ],
  exports: [AmisRangedateComponent]
})
export class AmisRangedateModule { }
