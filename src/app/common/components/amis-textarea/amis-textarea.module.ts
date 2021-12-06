import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AmisTextareaComponent } from "./amis-textarea.component";
import { FormsModule } from "@angular/forms";
import { DxTextAreaModule } from "devextreme-angular";



@NgModule({
  declarations: [AmisTextareaComponent],
  imports: [
    CommonModule,
    FormsModule,
    DxTextAreaModule
  ],
  exports: [AmisTextareaComponent]
})
export class MISATextareaModule { }
