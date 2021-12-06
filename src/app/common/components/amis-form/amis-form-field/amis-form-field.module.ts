import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisFormFieldComponent } from './amis-form-field.component';
import { AmisButtonModule } from '../../amis-button/amis-button.module';
import { AmisControlGroupRowModule } from '../../amis-control-group/amis-control-group-row/amis-control-group-row.module';
import { AmisFormDirectiveModule } from 'src/common/directive/form-directive/form-directive.module';
import { HandleGroupConfigsValidationModule } from 'src/app/shared/components/handle-group-configs-validation/handle-group-configs-validation.module';



@NgModule({
  declarations: [AmisFormFieldComponent],
  imports: [
    CommonModule,
    AmisButtonModule,
    AmisControlGroupRowModule,
    AmisFormDirectiveModule,
    HandleGroupConfigsValidationModule
  ],
  exports: [AmisFormFieldComponent]
})
export class AmisFormFieldModule { }
