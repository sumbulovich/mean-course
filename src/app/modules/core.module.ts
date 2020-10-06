import { AuthInterceptorProvider, ErrorInterceptorProvider } from 'src/app/shared/interceptors';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

@NgModule({
  exports: [
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [
    AuthInterceptorProvider,
    ErrorInterceptorProvider,
    // CustomBreakPointsProvider
  ]
})
export class CoreModule { }
