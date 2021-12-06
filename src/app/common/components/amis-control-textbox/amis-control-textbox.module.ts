import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisControlTextboxComponent } from './amis-control-textbox.component';
import { AmisFormControlModule } from 'src/common/components/amis-form-control/amis-form-control.module';
import { AmisTextboxModule } from 'src/common/components/amis-textbox/amis-textbox.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShareDirectiveModule } from 'src/app/shared/directive/share-directive/share-directive.module';
import { AmisIconModule } from '../amis-icon/amis-icon.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [AmisControlTextboxComponent],
  imports: [
    CommonModule,
    AmisFormControlModule,
    AmisTextboxModule,
    FormsModule, 
    ReactiveFormsModule,
    ShareDirectiveModule,
    AmisIconModule,
    TranslateModule
  ],
  exports: [AmisControlTextboxComponent]
})
export class AmisControlTextboxModule {
 }

