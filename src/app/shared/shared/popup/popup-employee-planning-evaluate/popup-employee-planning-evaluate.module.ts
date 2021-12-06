import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupEmployeePlanningEvaluateComponent } from './popup-employee-planning-evaluate.component';
import { TranslateModule } from '@ngx-translate/core';
import { DxTextBoxModule, DxDataGridModule } from 'devextreme-angular';
import { AmisPopupModule } from 'src/common/components/amis-popup/amis-popup.module';
import { AmisButtonModule } from 'src/common/components/amis-button/amis-button.module';
import { AmisPagingGridModule } from 'src/common/components/amis-grid/amis-paging-grid/amis-paging-grid.module';
import { DxSelectBoxModule } from 'devextreme-angular';
import { FormsModule } from '@angular/forms';
import { PopupBaseAddDataModule } from '../popup-base-add-data/popup-base-add-data.module';
import { ShareDirectiveModule } from '../../directive/share-directive/share-directive.module';


@NgModule({
  declarations: [PopupEmployeePlanningEvaluateComponent],
  imports: [
    CommonModule,
    TranslateModule,
    DxTextBoxModule,
    DxDataGridModule,
    AmisPopupModule,
    AmisButtonModule,
    AmisPagingGridModule,
    DxSelectBoxModule,
    FormsModule,
    PopupBaseAddDataModule,
    ShareDirectiveModule
  ],
  exports: [
    PopupEmployeePlanningEvaluateComponent
  ]
})
export class PopupEmployeePlanningEvaluateModule { }
