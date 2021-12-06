import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisLayoutFormGroupViewComponent } from './amis-layout-form-group-view.component';
import { TranslateModule } from '@ngx-translate/core';
import { AmisControlPopupModule } from 'src/common/components/amis-control-popup/amis-control-popup.module';
import { AmisFormComponentsModule } from 'src/common/components/amis-form-components/amis-form-components.module';
import { AmisButtonModule } from 'src/common/components/amis-button/amis-button.module';
import { AmisControlFormGroupModule } from 'src/common/components/amis-control-form-group/amis-control-form-group.module';
import { DxScrollViewModule } from 'devextreme-angular';
import { AmisLayoutModule } from '../../amis-layout.module';
import { AmisLayoutGroupModule } from '../../amis-layout-group/amis-layout-group.module';
import { AmisIconModule } from 'src/common/components/amis-icon/amis-icon.module';



@NgModule({
  declarations: [AmisLayoutFormGroupViewComponent],
  imports: [
    CommonModule,
    AmisControlPopupModule,
    AmisFormComponentsModule,
    AmisButtonModule,
    AmisControlFormGroupModule,
    TranslateModule,
    DxScrollViewModule,
    AmisLayoutModule,
    AmisLayoutGroupModule,
    AmisIconModule
  ],
  exports: [AmisLayoutFormGroupViewComponent]
})
export class AmisLayoutFormGroupViewModule { 
  static components = {
    form: AmisLayoutFormGroupViewComponent
  };
}
