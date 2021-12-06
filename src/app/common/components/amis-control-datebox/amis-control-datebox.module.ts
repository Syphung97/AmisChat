import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisControlDateboxComponent } from './amis-control-datebox.component';
import { AmisFormControlModule } from 'src/common/components/amis-form-control/amis-form-control.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DxDateBoxModule } from 'devextreme-angular';
import { ShareDirectiveModule } from 'src/app/shared/directive/share-directive/share-directive.module';
import { AmisIconModule } from '../amis-icon/amis-icon.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [AmisControlDateboxComponent],
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
  exports: [AmisControlDateboxComponent]
})
export class AmisControlDateboxModule {
}
