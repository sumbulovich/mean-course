import { ResetFieldDirective, MatchFieldsDirective } from 'src/app/shared/directives';
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
    SignRoutingModule
  ]
})
export class SignModule { }
