import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReplyMessageComponent } from './reply-message.component';
import { NoSantizeModule } from 'src/app/core/pipes/no-santize/no-santize.module';
import { NzImageModule } from 'ng-zorro-antd/image';



@NgModule({
  declarations: [
    ReplyMessageComponent
  ],
  imports: [
    CommonModule,
    NoSantizeModule,
    NzImageModule
  ],
  exports: [
    ReplyMessageComponent
  ]
})
export class ReplyMessageModule { }
