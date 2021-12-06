import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagementComponent } from './management.component';
import { ManagementRoutingModule } from './management-routing.module';
import { LayoutModule } from '../layout/layout.module';
import { SidebarModule } from '../layout/sidebar/sidebar.module';
import { NavbarModule } from '../layout/navbar/navbar.module';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';



@NgModule({
  declarations: [
    ManagementComponent
  ],
  imports: [
    CommonModule,
    ManagementRoutingModule,
    LayoutModule,
    SidebarModule,
    NavbarModule,
    NzIconModule,
    NzMenuModule
  ]
})
export class ManagementModule { }
