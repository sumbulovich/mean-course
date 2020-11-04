import { AppRoutingModule } from './app-routing.module';
import { LayoutModule } from './modules/layout/layout.module';
import { CoreModule } from './modules/core.module';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

@NgModule( {
  declarations: [
    AppComponent,
  ],
  imports: [
    CoreModule,
    LayoutModule,
    AppRoutingModule,
  ], // Lazy loading set, so there's not modules imported
  bootstrap: [ AppComponent ]
} )
export class AppModule { }
