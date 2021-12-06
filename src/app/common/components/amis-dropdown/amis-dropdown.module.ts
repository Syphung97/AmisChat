import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisDropdownComponent } from './amis-dropdown.component';



@NgModule({
  declarations: [AmisDropdownComponent],
  imports: [
    CommonModule
  ],
  exports: [AmisDropdownComponent]
})
export class AmisDropdownModule { }
