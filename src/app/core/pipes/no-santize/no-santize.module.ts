import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoSanitize } from './no-sanitize.pipe';



@NgModule({
  declarations: [NoSanitize],
  imports: [
    CommonModule
  ],
  exports: [NoSanitize]
})
export class NoSantizeModule { }
