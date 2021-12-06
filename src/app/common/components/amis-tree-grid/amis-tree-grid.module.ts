import { NgModule } from '@angular/core';
import { AmisTreeGridComponent } from './amis-tree-grid.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DxTextBoxModule, DxCheckBoxModule, DxTreeListModule, DxPopoverModule } from 'devextreme-angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AmisButtonModule } from '../amis-button/amis-button.module';
import { AmisListDragDropModule } from '../amis-list-drag-drop/amis-list-drag-drop.module';
import { ShareDirectiveModule } from 'src/app/shared/directive/share-directive/share-directive.module';
import { AmisIconModule } from '../amis-icon/amis-icon.module';

@NgModule({
  declarations: [AmisTreeGridComponent],
  imports: [
    CommonModule,
    TranslateModule,
    DxTreeListModule,
    DxTextBoxModule,
    DxCheckBoxModule,
    DxPopoverModule,
    NgbModule,
    AmisButtonModule,
    AmisListDragDropModule,
    ShareDirectiveModule,
    AmisIconModule
  ],
  exports: [AmisTreeGridComponent]
})
export class AmisTreeGridModule { }
