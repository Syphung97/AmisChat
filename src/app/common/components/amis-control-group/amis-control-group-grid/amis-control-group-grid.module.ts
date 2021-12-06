import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisControlGroupGridComponent } from './amis-control-group-grid.component';
import { AmisButtonModule } from '../../amis-button/amis-button.module';
import { AmisListDragDropModule } from '../../amis-list-drag-drop/amis-list-drag-drop.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AmisPagingGridModule } from '../../amis-grid/amis-paging-grid/amis-paging-grid.module';
import { AmisPopupModule } from '../../amis-popup/amis-popup.module';
import { TranslateModule } from '@ngx-translate/core';
import { ShareDirectiveModule } from 'src/app/shared/directive/share-directive/share-directive.module';



@NgModule({
  declarations: [AmisControlGroupGridComponent],
  imports: [
    CommonModule,
    AmisButtonModule,
    AmisListDragDropModule,
    NgbModule,
    AmisPagingGridModule, 
    AmisPopupModule,
    TranslateModule,
    ShareDirectiveModule
  ],
  exports: [AmisControlGroupGridComponent]
})
export class AmisControlGroupGridModule { }
