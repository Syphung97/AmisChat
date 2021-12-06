import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisLoadingComponent } from './amis-loading.component';



@NgModule({
  declarations: [AmisLoadingComponent],
  imports: [
    CommonModule
  ],
  exports: [AmisLoadingComponent]
})
export class AmisLoadingModule { }