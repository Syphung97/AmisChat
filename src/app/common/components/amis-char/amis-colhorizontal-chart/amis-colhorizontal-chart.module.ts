import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisColhorizontalChartComponent } from './amis-colhorizontal-chart.component';
import { DxChartModule } from "devextreme-angular";


@NgModule({
  declarations: [AmisColhorizontalChartComponent],
  imports: [CommonModule, DxChartModule],
  exports: [AmisColhorizontalChartComponent]
})
export class AmisColhorizontalChartModule {}
