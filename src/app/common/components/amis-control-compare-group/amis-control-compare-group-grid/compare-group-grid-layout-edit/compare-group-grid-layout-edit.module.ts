import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompareGroupGridLayoutEditComponent } from './compare-group-grid-layout-edit.component';
import { TranslateModule } from '@ngx-translate/core';
import { AmisControlPopupModule } from 'src/common/components/amis-control-popup/amis-control-popup.module';
import { AmisFormComponentsModule } from 'src/common/components/amis-form-components/amis-form-components.module';
import { AmisButtonModule } from 'src/common/components/amis-button/amis-button.module';
import { AmisControlFormGroupModule } from 'src/common/components/amis-control-form-group/amis-control-form-group.module';
import { DxScrollViewModule } from 'devextreme-angular';
import { AmisIconModule } from 'src/common/components/amis-icon/amis-icon.module';
import { CompareGroupGridFormEditModule } from '../compare-group-grid-form-edit/compare-group-grid-form-edit.module';


@NgModule({
  declarations: [CompareGroupGridLayoutEditComponent],
  imports: [
    CommonModule,
    AmisControlPopupModule,
    AmisFormComponentsModule,
    AmisButtonModule,
    AmisControlFormGroupModule,
    TranslateModule,
    DxScrollViewModule,
    CompareGroupGridFormEditModule,
    AmisIconModule
  ]
})
export class CompareGroupGridLayoutEditModule {
  static components = {
    form: CompareGroupGridLayoutEditComponent
  }
}
