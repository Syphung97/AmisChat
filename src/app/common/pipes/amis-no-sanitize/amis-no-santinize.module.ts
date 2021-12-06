import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AmisNoSanitize } from "./no-sanitize.pipe";



@NgModule({
  declarations: [AmisNoSanitize],
  imports: [
    CommonModule
  ],
  exports: [AmisNoSanitize]
})
export class AmisNoSanitizeModule { }