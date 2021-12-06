import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HrmEmployeeSelfComponent } from './hrm-employee-self.component';
import { AmisButtonModule } from 'src/common/components/amis-button/amis-button.module';
import { AmisFormDirectiveModule } from 'src/common/directive/form-directive/form-directive.module';
import { DxPopoverModule } from 'devextreme-angular';
import { HrmEmployeeSelfGridModule } from './hrm-employee-self-grid/hrm-employee-self-grid.module';
import { AmisControlGroupRowModule } from 'src/common/components/amis-control-group/amis-control-group-row/amis-control-group-row.module';



@NgModule({
  declarations: [HrmEmployeeSelfComponent],
  imports: [
    CommonModule,
    AmisButtonModule,
    AmisFormDirectiveModule,
    DxPopoverModule,
    HrmEmployeeSelfGridModule,
    AmisControlGroupRowModule
  ],
  exports: [HrmEmployeeSelfComponent]
})
export class HrmEmployeeSelfModule { }
