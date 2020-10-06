import { AccountModule } from './modules/account/account.module';
import { AppRoutingModule } from './app-routing.module';
import { HomeModule } from './modules/home/home.module';
import { LayoutModule } from './modules/layout/layout.module';
import { CoreModule } from './modules/core.module';
import { SignModule } from './modules/sign/sign.module';
import { PostModule } from './modules/post/post.module';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

@NgModule( {
  declarations: [
    AppComponent
  ],
  imports: [
    CoreModule,
    LayoutModule,
    HomeModule,
    PostModule,
    SignModule,
    AccountModule
  ],
  bootstrap: [ AppComponent ]
} )
export class AppModule { }
