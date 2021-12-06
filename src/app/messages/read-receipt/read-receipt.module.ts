import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReadReceiptComponent } from './read-receipt.component';
import { AvatarModule } from 'src/app/shared/components/avatar/avatar.module';



@NgModule({
  declarations: [
    ReadReceiptComponent
  ],
  imports: [
    CommonModule,
    AvatarModule
  ],
  exports: [ReadReceiptComponent]
})
export class ReadReceiptModule { }
