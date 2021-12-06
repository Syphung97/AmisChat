import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisColumnCharComponent } from './amis-column-char.component';
import { DxChartModule, DxTooltipModule } from 'devextreme-angular';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [AmisColumnCharComponent],
  imports: [
    DxChartModule,
    CommonModule,
    DxTooltipModule,
    TranslateModule
  ],
  exports:[AmisColumnCharComponent]
})
export class AmisColumnCharModule { }
