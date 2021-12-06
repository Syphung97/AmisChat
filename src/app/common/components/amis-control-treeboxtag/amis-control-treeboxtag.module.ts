import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisControlTreeBoxTagComponent } from './amis-control-treeboxtag.component';
import { AmisFormControlModule } from '../amis-form-control/amis-form-control.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DxTreeViewModule, DxScrollViewModule, DxPopoverModule } from 'devextreme-angular';
import { ShareDirectiveModule } from 'src/app/shared/directive/share-directive/share-directive.module';
import { AmisIconModule } from '../amis-icon/amis-icon.module';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [AmisControlTreeBoxTagComponent],
  imports: [
    CommonModule,
    AmisFormControlModule,
    FormsModule,
    DxTreeViewModule,
    DxScrollViewModule,
    DxPopoverModule,
    ReactiveFormsModule,
    ShareDirectiveModule,
    AmisIconModule,
    TranslateModule
  ],
  exports: [AmisControlTreeBoxTagComponent],
})
export class AmisControlTreeBoxTagModule { }
