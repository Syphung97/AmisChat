import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AMISDatetimePipe } from "./amis-datetime.pipe";



@NgModule({
  declarations: [AMISDatetimePipe],
  imports: [
    CommonModule
  ],
  exports: [AMISDatetimePipe]
})
export class AmisDatetimeModule { }
