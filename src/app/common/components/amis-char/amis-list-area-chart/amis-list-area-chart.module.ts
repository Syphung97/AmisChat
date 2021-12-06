import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisListAreaChartComponent } from './amis-list-area-chart.component';
import { DxChartModule } from "devextreme-angular";



@NgModule({
  declarations: [AmisListAreaChartComponent],
  imports: [CommonModule, DxChartModule],
  exports: [AmisListAreaChartComponent]
})
export class AmisListAreaChartModule {}
