import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisControlTreeBoxComponent } from './amis-control-treebox.component';
import { AmisFormControlModule } from '../amis-form-control/amis-form-control.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DxTreeViewModule, DxDropDownBoxModule } from 'devextreme-angular';
import { DxLoadPanelModule } from 'devextreme-angular';
import { ShareDirectiveModule } from 'src/app/shared/directive/share-directive/share-directive.module';
import { AmisIconModule } from '../amis-icon/amis-icon.module';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [AmisControlTreeBoxComponent],
  imports: [
    CommonModule,
    AmisFormControlModule,
    FormsModule,
    DxTreeViewModule,
    DxDropDownBoxModule,
    ReactiveFormsModule,
    DxLoadPanelModule,
    ShareDirectiveModule,
    AmisIconModule,
    TranslateModule
  ],
  exports: [AmisControlTreeBoxComponent],
})
export class AmisControlTreeBoxModule { }
