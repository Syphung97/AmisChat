import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AMISCurrencyPipe } from './amis-currency.pipe';




@NgModule({
  declarations: [AMISCurrencyPipe],
  imports: [
    CommonModule
  ],
  exports: [AMISCurrencyPipe]

})
export class AMISCurrencyModule { }
