import { Ng2ImgMaxModule } from 'ng2-img-max';
import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './components/account.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared.module';
import { NgModule } from '@angular/core';
import { CloseAccountComponent } from './components/close-account/close-account.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';

@NgModule({
  declarations: [
    AccountComponent,
    ProfileComponent,
    CloseAccountComponent,
    ChangePasswordComponent
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    AccountRoutingModule,
    Ng2ImgMaxModule
  ]
})
export class AccountModule { }
