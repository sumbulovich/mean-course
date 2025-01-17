import { SignComponent } from './components/sign/sign.component';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../shared.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ForgotComponent } from './components/forgot/forgot.component';
import { AuthComponent } from './components/auth.component';
import { ResetComponent } from './components/reset/reset.component';

@NgModule({
  declarations: [
    SignComponent,
    ForgotComponent,
    AuthComponent,
    ResetComponent
  ],
  imports: [
    SharedModule,
    FormsModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
