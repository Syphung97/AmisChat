import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisLayoutGroupFormComponent } from './amis-layout-group-form.component';
import { AmisControlFormGroupModule } from '../../amis-control-form-group/amis-control-form-group.module';



@NgModule({
  declarations: [AmisLayoutGroupFormComponent],
  imports: [
    CommonModule,
    AmisControlFormGroupModule
  ]
})
export class AmisLayoutGroupFormModule { }
