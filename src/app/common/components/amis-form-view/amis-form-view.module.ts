import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisFormViewComponent } from './amis-form-view.component';



@NgModule({
  declarations: [AmisFormViewComponent],
  imports: [
    CommonModule
  ],
  exports: [AmisFormViewComponent]
})
export class AmisFormViewModule { }
