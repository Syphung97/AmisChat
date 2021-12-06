import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotifyMessageComponent } from './notify-message.component';
import { NoSantizeModule } from 'src/app/core/pipes/no-santize/no-santize.module';



@NgModule({
  declarations: [
    NotifyMessageComponent
  ],
  imports: [
    CommonModule,
    NoSantizeModule
  ],
  exports: [
    NotifyMessageComponent
  ]
})
export class NotifyMessageModule { }
