import { DialogsModule } from './dialogs/dialogs.module';
import { AuthInterceptor } from './auth/auth.interceptor';
import { MaterialModule } from './material.module';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { PostCreateComponent } from './post/post-create/post-create.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { PostListComponent } from './post/post-list/post-list.component';
import { AppRoutingModule } from './app-routing.module';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { SignComponent } from './auth/sign/sign.component';
import { MatchFieldsDirective } from './auth/match-fields/match-fields.directive';

@NgModule( {
  declarations: [
    AppComponent,
    PostCreateComponent,
    HeaderComponent,
    PostListComponent,
    SignComponent,
    MatchFieldsDirective,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    DialogsModule,
    HttpClientModule,
    AppRoutingModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule,
    Ng2ImgMaxModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
    // multi as true adds a new Interceptor instead to override the existing ones
  ],
  bootstrap: [ AppComponent ]
} )
export class AppModule { }
