import { ResetFieldDirective } from './../../shared/directives/reset-field.directive';
import { BrowserModule } from '@angular/platform-browser';
import { MatchFieldsDirective } from './../../shared/directives/match-fields.directive';
import { SignRoutingModule } from './sign-routing.module';
import { SharedModule } from './../shared.module';
import { FormsModule } from '@angular/forms';
import { SignComponent } from './components/sign/sign.component';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    SignComponent,
    MatchFieldsDirective,
    ResetFieldDirective
  ],
  imports: [
    SharedModule,
    FormsModule,
    BrowserModule,
    SignRoutingModule
  ]
})
export class SignModule { }
