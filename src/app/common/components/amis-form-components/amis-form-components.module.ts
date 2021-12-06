import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisFormComponentsComponent } from './amis-form-components.component';

@NgModule({
  declarations: [AmisFormComponentsComponent],
  imports: [
    CommonModule
  ],
  exports: [AmisFormComponentsComponent]
})
export class AmisFormComponentsModule { }
