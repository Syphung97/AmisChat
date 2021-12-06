import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcedureViewDetailComponent } from './procedure-view-detail.component';
import { AmisControlPopupModule } from 'src/common/components/amis-control-popup/amis-control-popup.module';



@NgModule({
  declarations: [ProcedureViewDetailComponent],
  imports: [
    CommonModule,
    AmisControlPopupModule
  ],
  exports: [ProcedureViewDetailComponent]
})
export class ProcedureViewDetailModule {
  static components = {
    form: ProcedureViewDetailComponent
  };
 }
