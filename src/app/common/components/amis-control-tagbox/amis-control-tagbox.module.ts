import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisControlTagboxComponent } from './amis-control-tagbox.component';
import { AmisFormControlModule } from '../amis-form-control/amis-form-control.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DxTagBoxModule } from 'devextreme-angular';
import { DxLoadPanelModule } from 'devextreme-angular';
import { ShareDirectiveModule } from 'src/app/shared/directive/share-directive/share-directive.module';
import { AmisIconModule } from '../amis-icon/amis-icon.module';

@NgModule({
  declarations: [AmisControlTagboxComponent],
  imports: [
    CommonModule,
    AmisFormControlModule,
    FormsModule,
    ReactiveFormsModule,
    DxTagBoxModule,
    DxLoadPanelModule,
    ShareDirectiveModule,
    AmisIconModule
  ],
  exports: [AmisControlTagboxComponent]
})
export class AmisControlTagboxModule { }
