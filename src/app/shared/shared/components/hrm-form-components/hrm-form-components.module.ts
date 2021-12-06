import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HrmFormComponentsComponent } from './hrm-form-components.component';

@NgModule({
  declarations: [HrmFormComponentsComponent],
  imports: [
    CommonModule
  ],
  exports: [HrmFormComponentsComponent]
})
export class HrmFormComponentsModule { }
