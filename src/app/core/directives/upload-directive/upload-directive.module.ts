import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropToUploadDirective } from './drag-drop-to-upload.directive';



@NgModule({
  declarations: [DragDropToUploadDirective],
  imports: [
    CommonModule
  ],
  exports: [
    DragDropToUploadDirective
  ]
})
export class UploadDirectiveModule { }
