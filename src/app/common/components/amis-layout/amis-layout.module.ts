import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisLayoutComponent } from './amis-layout.component';
import { AmisControlFormGroupModule } from '../amis-control-form-group/amis-control-form-group.module';
import { AmisButtonModule } from '../amis-button/amis-button.module';
import { DxScrollViewModule } from 'devextreme-angular';
import { TranslateModule } from '@ngx-translate/core';
import { AmisFormComponentsModule } from '../amis-form-components/amis-form-components.module';
import { AmisPopupModule } from '../amis-popup/amis-popup.module';
import { ShareDirectiveModule } from 'src/app/shared/directive/share-directive/share-directive.module';

@NgModule({
  declarations: [AmisLayoutComponent],
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
  exports: [AmisLayoutComponent]
})
export class AmisLayoutModule { }
