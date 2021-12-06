import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MisaLoadingButtonDirective } from 'src/common/directive/common-directive/misa-loading-button.directive';



@NgModule({
  declarations: [
    MisaLoadingButtonDirective,
  ],
  imports: [
    CommonModule
  ],
  exports: [MisaLoadingButtonDirective],

})
export class BaseModule { }