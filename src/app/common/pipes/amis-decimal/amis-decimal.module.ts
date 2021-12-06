import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AMISDecimalPipe } from './amis-decimal.pipe';



@NgModule({
  declarations: [AMISDecimalPipe],
  imports: [
    CommonModule
  ],
  exports: [AMISDecimalPipe]
})
export class AmisAMISDecimalModule { }
