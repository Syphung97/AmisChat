import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisTabsComponent } from './amis-tabs.component';
import { DxScrollViewModule, DxPopoverModule, DxTextBoxModule } from 'devextreme-angular';
import { AmisButtonModule } from '../amis-button/amis-button.module';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ShareDirectiveModule } from 'src/app/shared/directive/share-directive/share-directive.module';


@NgModule({
  declarations: [AmisTabsComponent],
  imports: [
    CommonModule,
    DxScrollViewModule,
    AmisButtonModule,
    DxPopoverModule,
    DxTextBoxModule,
    FormsModule,
    TranslateModule,
    ShareDirectiveModule
  ],
  exports:[AmisTabsComponent]
})
export class AmisTabsModule { }
