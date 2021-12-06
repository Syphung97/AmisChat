import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AMISDatePipe } from "./amis-date.pipe";



@NgModule({
  declarations: [AMISDatePipe],
  imports: [
    CommonModule
  ],
  exports: [AMISDatePipe]

})
export class AMISDateModule { }
