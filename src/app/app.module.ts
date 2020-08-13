import { MaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { PostCreateComponent } from './post/post-create/post-create.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { PostListComponent } from './post/post-list/post-list.component';
import { AppRoutingModule } from './app-routing.module';
import { Ng2ImgMaxModule } from 'ng2-img-max';

@NgModule( {
  declarations: [
    AppComponent,
    PostCreateComponent,
    HeaderComponent,
    PostListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    AppRoutingModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    Ng2ImgMaxModule
  ],
  providers: [],
  bootstrap: [ AppComponent ]
} )
export class AppModule { }
