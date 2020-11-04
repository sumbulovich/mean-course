import { AppRoutingModule } from './../../app-routing.module';
import { SharedModule } from './../shared.module';
import { HeaderComponent } from './components/header/header.component';
import { NgModule } from '@angular/core';
import { LayoutComponent } from './components/layout.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [
    HeaderComponent,
    LayoutComponent,
    SidebarComponent,
    FooterComponent,
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
