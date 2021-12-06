import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AmisGridMemberComponent } from './amis-grid-member.component';
import { AmisPagingGridModule } from '../amis-paging-grid/amis-paging-grid.module';
import { DxDataGridModule } from 'devextreme-angular';




@NgModule({
  declarations: [AmisGridMemberComponent],
  imports: [
    CommonModule,
    DxDataGridModule,
    AmisPagingGridModule,
    TranslateModule
  ],
  exports:[AmisGridMemberComponent]
})
export class AmisGridMemberModule { }
