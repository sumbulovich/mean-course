import { HomeComponent } from './components/home/home.component';
import { PageRoutingModule } from './page-routing.module';
import { SharedModule } from '../shared.module';
import { NgModule } from '@angular/core';
import { ErrorComponent } from './components/error/error.component';

@NgModule({
  declarations: [
    HomeComponent,
    ErrorComponent
  ],
  imports: [
    SharedModule,
    PageRoutingModule
  ]
})
export class PageModule { }
