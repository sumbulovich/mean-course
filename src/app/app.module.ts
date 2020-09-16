import { SignModule } from './modules/sign/sign.module';
import { PostModule } from './modules/post/post.module';
import { SharedModule } from './modules/shared.module';
import { HeaderComponent } from './core/header/header.component';
import { AuthInterceptor, ErrorInterceptor } from './shared/interceptors';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './core/home/home.component';
import { ResetFieldDirective } from './shared/directives/reset-field.directive';

@NgModule( {
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent
  ],
  imports: [
    HttpClientModule,
    AppRoutingModule,
    SharedModule,
    PostModule,
    SignModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
    // multi as true adds a new Interceptor instead to override the existing ones
  ],
  bootstrap: [ AppComponent ]
} )
export class AppModule { }
