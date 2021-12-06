import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisControlGroupRowComponent } from './amis-control-group-row.component';
import { AmisControlFieldModule } from '../../amis-control-field/amis-control-field.module';



@NgModule({
  declarations: [AmisControlGroupRowComponent],
  imports: [
    CommonModule,
    AmisControlFieldModule
  ],
  exports: [AmisControlGroupRowComponent]
})
export class AmisControlGroupRowModule { }
