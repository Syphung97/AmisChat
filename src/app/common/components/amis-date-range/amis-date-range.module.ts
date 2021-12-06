import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisDateRangeComponent } from './amis-date-range.component';
import { DxScrollViewModule } from 'devextreme-angular';
import { TranslateModule } from '@ngx-translate/core';
import { AmisControlDateboxModule } from '../amis-control-datebox/amis-control-datebox.module';
import { AmisControlComboboxModule } from '../amis-control-combobox/amis-control-combobox.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [AmisDateRangeComponent],
  imports: [
    CommonModule,
    DxScrollViewModule,
    TranslateModule,
    AmisControlDateboxModule,
    AmisControlComboboxModule,
    FormsModule
  ],
  exports:[AmisDateRangeComponent]
})
export class AmisDateRangeModule { }
