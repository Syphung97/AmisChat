import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompareGroupGridFormEditComponent } from './compare-group-grid-form-edit.component';
import { DxScrollViewModule } from 'devextreme-angular';

import { TranslateModule } from '@ngx-translate/core';
import { ShareDirectiveModule } from 'src/app/shared/directive/share-directive/share-directive.module';
import { AmisControlFormGroupModule } from 'src/common/components/amis-control-form-group/amis-control-form-group.module';
import { AmisFormComponentsModule } from 'src/common/components/amis-form-components/amis-form-components.module';
import { AmisButtonModule } from 'src/common/components/amis-button/amis-button.module';
import { AmisPopupModule } from 'src/common/components/amis-popup/amis-popup.module';


@NgModule({
  declarations: [CompareGroupGridFormEditComponent],
  imports: [
    CommonModule,
    AmisControlFormGroupModule,
    AmisFormComponentsModule,
    AmisButtonModule,
    DxScrollViewModule,
    TranslateModule,
    AmisPopupModule,
    ShareDirectiveModule
  ],
  exports: [CompareGroupGridFormEditComponent]
})
export class CompareGroupGridFormEditModule {
}
