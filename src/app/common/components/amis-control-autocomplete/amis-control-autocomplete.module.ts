import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisControlAutocompleteComponent } from './amis-control-autocomplete.component';
import { AmisFormControlModule } from '../amis-form-control/amis-form-control.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DxLoadPanelModule, DxAutocompleteModule, DxSelectBoxModule } from 'devextreme-angular';
import { ShareDirectiveModule } from 'src/app/shared/directive/share-directive/share-directive.module';
import { AmisIconModule } from '../amis-icon/amis-icon.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [AmisControlAutocompleteComponent],
  imports: [
    CommonModule,
    AmisFormControlModule,
    FormsModule,
    ReactiveFormsModule,
    DxLoadPanelModule,
    DxAutocompleteModule,
    ShareDirectiveModule,
    AmisIconModule,
    TranslateModule,
    DxSelectBoxModule
  ],
  exports: [
    AmisControlAutocompleteComponent
  ]
})
export class AmisControlAutocompleteModule { }
