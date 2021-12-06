import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AmisShortNamePipe } from './amis-short-name.pipe';



@NgModule({
  declarations: [AmisShortNamePipe],
  imports: [
    CommonModule
  ],
  exports: [AmisShortNamePipe]
})
export class AmisShortNameModule { }
