import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AmisColumnHighchartsComponent } from "./amis-column-highcharts.component";
import { DxChartModule } from "devextreme-angular";
import { MisaPipesModule } from "src/app/shared/pipes/misa-pipe.module";
@NgModule({
  declarations: [AmisColumnHighchartsComponent],
  imports: [CommonModule, DxChartModule, MisaPipesModule],
  exports: [AmisColumnHighchartsComponent]
})
export class AmisColumnHighchartsModule {}
