import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisToolbarReportComponent } from './amis-toolbar-report.component';
import { AmisButtonModule } from '../amis-button/amis-button.module';
import { DxScrollViewModule } from 'devextreme-angular';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DxDropDownBoxModule} from 'devextreme-angular';
import { AmisControlComboboxModule } from '../amis-control-combobox/amis-control-combobox.module';
import { FormsModule } from '@angular/forms';
import { AmisListDragDropModule } from '../amis-list-drag-drop/amis-list-drag-drop.module';
import { ShareDirectiveModule } from 'src/app/shared/directive/share-directive/share-directive.module';
import { AmisIconModule } from '../amis-icon/amis-icon.module';


@NgModule({
  declarations: [AmisToolbarReportComponent],
  imports: [
    CommonModule,
    AmisButtonModule,
    DxScrollViewModule,
    TranslateModule,
    NgbModule,
    DxDropDownBoxModule,
    AmisControlComboboxModule,
    FormsModule,
    AmisListDragDropModule,
    ShareDirectiveModule,
    AmisIconModule,
  ],
  exports:[
    AmisToolbarReportComponent
  ]
})
export class AmisToolbarReportModule { }
