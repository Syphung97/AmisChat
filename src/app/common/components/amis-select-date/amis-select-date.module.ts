import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisSelectDateComponent } from './amis-select-date.component';
import { DxSelectBoxModule, DxDateBoxModule, DxDropDownBoxModule, DxTreeViewModule, DxPopoverModule, DxScrollViewModule, DxTextBoxModule, DxCalendarModule } from 'devextreme-angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AmisButtonModule } from '../amis-button/amis-button.module';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [AmisSelectDateComponent],
  imports: [
    CommonModule,
    DxSelectBoxModule,
    DxDateBoxModule,
    NgbModule,
    DxDropDownBoxModule,
    DxTreeViewModule,
    AmisButtonModule,
    DxPopoverModule,
    DxScrollViewModule,
    DxTextBoxModule,
    DxCalendarModule,
    TranslateModule
  ],
  exports:[AmisSelectDateComponent]
})
export class AmisSelectDateModule { }