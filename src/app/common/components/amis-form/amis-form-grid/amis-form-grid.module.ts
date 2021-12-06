import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisFormGridComponent } from './amis-form-grid.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [AmisFormGridComponent],
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports:[
    AmisFormGridComponent
  ]
})
export class AmisFormGridModule { }
