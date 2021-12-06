import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManagementComponent } from './management.component';

const routes: Routes = [
  {
    path: '', component: ManagementComponent,
    children: [
      {
        path: "new"
      },
      {
        path: "m/:id",
        loadChildren: () => import("../conversation/conversation-box/conversation-box.module").then(m => m.ConversationBoxModule)
      }
    ]
  },

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementRoutingModule { }
