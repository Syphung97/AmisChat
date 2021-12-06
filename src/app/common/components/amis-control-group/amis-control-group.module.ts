import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisControlGroupComponent } from './amis-control-group.component';
import { AmisControlGroupRowModule } from './amis-control-group-row/amis-control-group-row.module';
import { AmisButtonModule } from '../amis-button/amis-button.module';
import { AmisControlGroupGridModule } from './amis-control-group-grid/amis-control-group-grid.module';
import { AmisFormDirectiveModule } from 'src/common/directive/form-directive/form-directive.module';
import { HandleGroupConfigsValidationModule } from 'src/app/shared/components/handle-group-configs-validation/handle-group-configs-validation.module';
import { ShareDirectiveModule } from 'src/app/shared/directive/share-directive/share-directive.module';
import { DxPopoverModule } from 'devextreme-angular';
import { AmisIconModule } from '../amis-icon/amis-icon.module';

@NgModule({
  declarations: [AmisControlGroupComponent],
  imports: [
    CommonModule,
    AmisControlGroupRowModule,
    AmisButtonModule,
    AmisControlGroupGridModule,
    AmisFormDirectiveModule,
    HandleGroupConfigsValidationModule,
    ShareDirectiveModule,
    DxPopoverModule,
    AmisIconModule
  ],
  exports: [AmisControlGroupComponent]
})
export class AmisControlGroupModule { }
