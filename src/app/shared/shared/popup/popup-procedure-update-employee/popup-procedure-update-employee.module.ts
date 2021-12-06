import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupProcedureUpdateEmployeeComponent } from './popup-procedure-update-employee.component';

import { AmisPopupModule } from 'src/common/components/amis-popup/amis-popup.module';
import { FormsModule } from '@angular/forms';

import { AmisButtonModule } from 'src/common/components/amis-button/amis-button.module';
import { AmisControlFormGroupModule } from 'src/common/components/amis-control-form-group/amis-control-form-group.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [PopupProcedureUpdateEmployeeComponent],
  imports: [
    CommonModule,
    AmisPopupModule,
    FormsModule,
    AmisButtonModule,
    AmisControlFormGroupModule,
    TranslateModule
  ],
  exports: [PopupProcedureUpdateEmployeeComponent]
})
export class PopupProcedureUpdateEmployeeModule { }
