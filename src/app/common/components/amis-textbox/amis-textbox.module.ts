import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisTextboxComponent } from './amis-textbox.component';
import { FormsModule } from "@angular/forms";



@NgModule({
  declarations: [AmisTextboxComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [AmisTextboxComponent]
})
export class AmisTextboxModule { }
