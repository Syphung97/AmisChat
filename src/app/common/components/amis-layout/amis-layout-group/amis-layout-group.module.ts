import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisLayoutGroupComponent } from './amis-layout-group.component';
import { AmisControlFormGroupModule } from '../../amis-control-form-group/amis-control-form-group.module';
import { AmisFormComponentsModule } from '../../amis-form-components/amis-form-components.module';
import { AmisButtonModule } from '../../amis-button/amis-button.module';
import { DxScrollViewModule } from 'devextreme-angular';
import { AmisPopupModule } from '../../amis-popup/amis-popup.module';
import { TranslateModule } from '@ngx-translate/core';
import { ShareDirectiveModule } from 'src/app/shared/directive/share-directive/share-directive.module';



@NgModule({
  declarations: [AmisLayoutGroupComponent],
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
  exports: [AmisLayoutGroupComponent]
})
export class AmisLayoutGroupModule { }
