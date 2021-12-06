import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupViewComponent } from './popup-view.component';
import { AmisControlPopupModule } from 'src/common/components/amis-control-popup/amis-control-popup.module';


@NgModule({
  declarations: [PopupViewComponent],
  imports: [
    CommonModule,
    AmisControlPopupModule
  ],
  exports: [PopupViewComponent]
})
export class PopupViewModule {
  static components = {
    form: PopupViewComponent
  };
}
