import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisControlFormGroupComponent } from './amis-control-form-group.component';
import { AmisButtonModule } from '../amis-button/amis-button.module';
import { AmisControlGroupModule } from '../amis-control-group/amis-control-group.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [AmisControlFormGroupComponent],
  imports: [
    CommonModule,
    AmisButtonModule,
    AmisControlGroupModule,
    TranslateModule
  ],
  exports: [AmisControlFormGroupComponent]
})
export class AmisControlFormGroupModule { }
