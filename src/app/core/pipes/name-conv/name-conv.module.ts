import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NameConvPipe } from './name-conv.pipe';



@NgModule({
  declarations: [
    NameConvPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [NameConvPipe]
})
export class NameConvModule { }
