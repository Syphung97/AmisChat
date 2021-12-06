import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisControlCompareGroupComponent } from './amis-control-compare-group.component';
import { AmisControlCompareGroupGridModule } from './amis-control-compare-group-grid/amis-control-compare-group-grid.module';
import { AmisControlCompareGroupRowModule } from './amis-control-compare-group-row/amis-control-compare-group-row.module';



@NgModule({
  declarations: [AmisControlCompareGroupComponent],
  imports: [
    CommonModule,
    AmisControlCompareGroupGridModule,
    AmisControlCompareGroupRowModule
  ],
  exports: [AmisControlCompareGroupComponent]
})
export class AmisControlCompareGroupModule { }
