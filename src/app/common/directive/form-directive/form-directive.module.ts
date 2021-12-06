import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisFirstFocusInvalidDirective } from './first-focus-invalid.directive';
import { AmisFirstFocusDirective } from './first-focus.directive';




@NgModule({
  declarations: [
    AmisFirstFocusInvalidDirective,
    AmisFirstFocusDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AmisFirstFocusInvalidDirective,
    AmisFirstFocusDirective
  ]
})
export class AmisFormDirectiveModule {
}
