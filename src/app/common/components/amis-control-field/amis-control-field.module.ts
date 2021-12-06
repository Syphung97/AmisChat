import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisControlFieldComponent } from './amis-control-field.component';
import { FormsModule } from '@angular/forms';
import { AmisControlTagboxModule } from '../amis-control-tagbox/amis-control-tagbox.module';
import { AmisControlTreeBoxTagModule } from '../amis-control-treeboxtag/amis-control-treeboxtag.module';
import { AmisControlFormulaModule } from '../amis-control-formula/amis-control-formula.module';
import { AmisControlUploadFileModule } from '../amis-control-upload-file/amis-control-upload-file.module';
import { AmisControlSelectHumanModule } from '../amis-control-select-human/amis-control-select-human.module';
import { AmisControlTreeBoxModule } from '../amis-control-treebox/amis-control-treebox.module';
import { AmisControlFileSizeModule } from '../amis-control-filesize/amis-control-filesize.module';
import { AmisControlTextboxModule } from '../amis-control-textbox/amis-control-textbox.module';
import { AmisControlDateboxModule } from '../amis-control-datebox/amis-control-datebox.module';
import { AmisControlNumberboxModule } from '../amis-control-numberbox/amis-control-numberbox.module';
import { AmisControlCheckboxModule } from '../amis-control-checkbox/amis-control-checkbox.module';
import { AmisControlTextareaModule } from '../amis-control-textarea/amis-control-textarea.module';
import { AmisControlMonthyearModule } from '../amis-control-monthyear/amis-control-monthyear.module';
import { AmisControlComboboxModule } from '../amis-control-combobox/amis-control-combobox.module';
import { AmisControlAutocompleteModule } from '../amis-control-autocomplete/amis-control-autocomplete.module';



@NgModule({
  declarations: [AmisControlFieldComponent],
  imports: [
    CommonModule,
    AmisControlTextboxModule,
    AmisControlDateboxModule,
    AmisControlNumberboxModule,
    AmisControlCheckboxModule,
    AmisControlTextareaModule,
    AmisControlMonthyearModule,
    AmisControlComboboxModule,
    AmisControlTagboxModule,
    AmisControlFormulaModule,
    AmisControlUploadFileModule,
    AmisControlSelectHumanModule,
    AmisControlTreeBoxModule,
    AmisControlTreeBoxTagModule,
    AmisControlFileSizeModule,
    AmisControlAutocompleteModule,
    FormsModule
  ],
  exports: [AmisControlFieldComponent]
})
export class AmisControlFieldModule { }
