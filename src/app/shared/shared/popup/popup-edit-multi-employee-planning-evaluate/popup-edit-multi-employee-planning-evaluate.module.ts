import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupEditMultiEmployeePlanningEvaluateComponent } from './popup-edit-multi-employee-planning-evaluate.component';
import { TranslateModule } from '@ngx-translate/core';
import { DxTextBoxModule, DxDataGridModule } from 'devextreme-angular';
import { AmisPopupModule } from 'src/common/components/amis-popup/amis-popup.module';
import { AmisButtonModule } from 'src/common/components/amis-button/amis-button.module';
import { AmisPagingGridModule } from 'src/common/components/amis-grid/amis-paging-grid/amis-paging-grid.module';
import { DxSelectBoxModule } from 'devextreme-angular';
import { FormsModule } from '@angular/forms';
import { PopupEmployeePlanningEvaluateModule } from '../popup-employee-planning-evaluate/popup-employee-planning-evaluate.module';


@NgModule({
  declarations: [PopupEditMultiEmployeePlanningEvaluateComponent],
  imports: [
    CommonModule,
    TranslateModule,
    DxTextBoxModule,
    DxDataGridModule,
    AmisPopupModule,
    AmisButtonModule,
    AmisPagingGridModule,
    FormsModule,
    PopupEmployeePlanningEvaluateModule
  ],
  exports: [
    PopupEditMultiEmployeePlanningEvaluateComponent
  ]
})
export class PopupEditMultiEmployeePlanningEvaluateModule { }
