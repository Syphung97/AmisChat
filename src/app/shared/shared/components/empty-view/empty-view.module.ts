import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmptyViewComponent } from './empty-view.component';
import { AmisButtonModule } from 'src/common/components/amis-button/amis-button.module';
import { ShareDirectiveModule } from '../../directive/share-directive/share-directive.module';



@NgModule({
  declarations: [EmptyViewComponent],
  imports: [
    CommonModule,
    AmisButtonModule,
    ShareDirectiveModule
  ],
  exports: [
    EmptyViewComponent
  ]
})
export class EmptyViewModule { }
