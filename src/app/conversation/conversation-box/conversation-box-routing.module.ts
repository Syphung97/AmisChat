import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConversationBoxComponent } from './conversation-box.component';



const routes: Routes = [
  { path: '', component: ConversationBoxComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ConversationBoxRoutingModule { }
