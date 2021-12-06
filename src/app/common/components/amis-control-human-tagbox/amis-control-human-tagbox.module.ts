import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisControlHumanTagboxComponent } from './amis-control-human-tagbox.component';
import { DxTagBoxModule } from 'devextreme-angular';
import { FormsModule } from '@angular/forms';
import { AmisIconModule } from 'src/common/components/amis-icon/amis-icon.module';


@NgModule({
  declarations: [AmisControlHumanTagboxComponent],
  imports: [
    CommonModule,
    DxTagBoxModule,
    FormsModule,
    AmisIconModule
  ],
  exports: [AmisControlHumanTagboxComponent]
})
export class AmisControlHumanTagboxModule { }
