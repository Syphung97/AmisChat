import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CutCaptionRequirePipe } from './cut-caption-require.pipe';


@NgModule({
  declarations: [CutCaptionRequirePipe],
  imports: [
    CommonModule
  ],
  exports: [CutCaptionRequirePipe]

})
export class CutCaptionRequireModule { }
