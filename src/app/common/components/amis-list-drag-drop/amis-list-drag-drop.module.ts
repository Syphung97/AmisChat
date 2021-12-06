import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisListDragDropComponent } from './amis-list-drag-drop.component';
import { DxListModule } from 'devextreme-angular';
import { TranslateModule } from '@ngx-translate/core';
import { DxPopoverModule } from 'devextreme-angular';


@NgModule({
  declarations: [AmisListDragDropComponent],
  imports: [
    CommonModule,
    DxListModule,
    TranslateModule,
    DxPopoverModule
  ],
  exports: [AmisListDragDropComponent]
})
export class AmisListDragDropModule { }
