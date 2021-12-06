import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupAdjustOrganizationUnitComponent } from './popup-adjust-OrganizationUnit.component';
import { AmisPopupModule } from 'src/common/components/amis-popup/amis-popup.module';
import { AmisControlGroupModule } from 'src/common/components/amis-control-group/amis-control-group.module';
import { AmisButtonModule } from 'src/common/components/amis-button/amis-button.module';
import { TranslateModule } from '@ngx-translate/core';
import { DxTreeViewModule, DxDropDownBoxModule } from 'devextreme-angular';
import { AmisControlFormGroupModule } from 'src/common/components/amis-control-form-group/amis-control-form-group.module';


@NgModule({
  declarations: [PopupAdjustOrganizationUnitComponent],
  imports: [
    CommonModule,
    AmisPopupModule,
    AmisControlGroupModule,
    TranslateModule,
    AmisButtonModule,
    DxTreeViewModule,
    DxDropDownBoxModule,
    AmisControlFormGroupModule
  ],
  exports: [
    PopupAdjustOrganizationUnitComponent
  ]
})
export class PopupAdjustOrganizationUnitModule { }
