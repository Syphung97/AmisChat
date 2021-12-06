import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisControlMonthyearComponent } from './amis-control-monthyear.component';
import { AmisFormControlModule } from '../amis-form-control/amis-form-control.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DxDateBoxModule } from 'devextreme-angular';
import { ShareDirectiveModule } from 'src/app/shared/directive/share-directive/share-directive.module';
import { AmisIconModule } from '../amis-icon/amis-icon.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [AmisControlMonthyearComponent],
  imports: [
    CommonModule,
    AmisFormControlModule,
    FormsModule,
    DxDateBoxModule,
    ReactiveFormsModule,
    ShareDirectiveModule,
    AmisIconModule,
    TranslateModule
  ],
  exports: [AmisControlMonthyearComponent]
})
export class AmisControlMonthyearModule { }
