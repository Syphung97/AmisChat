import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupAddHealthCareComponent } from './popup-add-health-care.component';
import { AmisPopupModule } from 'src/common/components/amis-popup/amis-popup.module';
import { AmisControlGroupModule } from 'src/common/components/amis-control-group/amis-control-group.module';
import { AmisButtonModule } from 'src/common/components/amis-button/amis-button.module';



@NgModule({
  declarations: [PopupAddHealthCareComponent],
  imports: [
    CommonModule,
    AmisPopupModule,
    AmisControlGroupModule,
    AmisButtonModule
  ],
  exports: [
    PopupAddHealthCareComponent
  ]
})
export class PopupAddHealthCareModule { }
