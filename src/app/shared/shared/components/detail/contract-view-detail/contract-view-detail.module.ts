import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractViewDetailComponent } from './contract-view-detail.component';
import { AmisControlPopupModule } from 'src/common/components/amis-control-popup/amis-control-popup.module';



@NgModule({
  declarations: [ContractViewDetailComponent],
  imports: [
    CommonModule,
    AmisControlPopupModule
  ],
  exports : [ContractViewDetailComponent]
})
export class ContractViewDetailModule {
  static components = {
    form: ContractViewDetailComponent
  };
 }
