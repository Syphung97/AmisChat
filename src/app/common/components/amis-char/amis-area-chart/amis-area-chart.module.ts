import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AmisAreaChartComponent } from "./amis-area-chart.component";
import { DxChartModule } from "devextreme-angular";

@NgModule({
  declarations: [AmisAreaChartComponent],
  imports: [CommonModule, DxChartModule],
  exports: [AmisAreaChartComponent]
})
export class AmisAreaChartModule {}
