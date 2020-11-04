import { SignComponent } from './components/sign/sign.component';
import { AuthRoutingModule } from './auth-routing.module';
import { ResetFieldDirective, MatchFieldsDirective } from 'src/app/shared/directives';
import { SharedModule } from '../shared.module';
import { FormsModule } from '@angular/forms';
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
    AuthRoutingModule
  ]
})
export class AuthModule { }
