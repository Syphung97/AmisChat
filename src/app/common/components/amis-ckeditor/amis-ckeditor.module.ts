import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisCkeditorComponent } from './amis-ckeditor.component';
import {CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [AmisCkeditorComponent],
  imports: [
    CommonModule,
    CKEditorModule,
    FormsModule
  ],
  exports: [AmisCkeditorComponent]
})
export class AmisCkeditorModule { }
