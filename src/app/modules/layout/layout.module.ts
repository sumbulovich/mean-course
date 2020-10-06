import { AppRoutingModule } from './../../app-routing.module';
import { SharedModule } from './../shared.module';
import { HeaderComponent } from './components/header/header.component';
import { BodyComponent } from './components/body/body.component';
import { NgModule } from '@angular/core';
import { LayoutComponent } from './components/layout.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@NgModule({
  declarations: [
    HeaderComponent,
    BodyComponent,
    LayoutComponent,
    SidebarComponent,
  ],
  imports: [
    SharedModule,
    AppRoutingModule
  ],
  exports: [
    LayoutComponent
  ]
})
export class LayoutModule { }
