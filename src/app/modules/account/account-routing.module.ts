import { DeactivateGuard } from './../../shared/guards/deactivate.guard';
import { AuthGuard } from './../../shared/guards/auth.guard';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { PATHS } from 'src/app/shared/constants/globals';
import { CloseAccountComponent } from './components/close-account/close-account.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AccountComponent } from './components/account.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '', component: AccountComponent, children: [
      {
        path: PATHS.ACCOUNT.PROFILE,
        component: ProfileComponent,
        canDeactivate: [ DeactivateGuard ]
      },
      { path: PATHS.ACCOUNT.CHANGE_PASSWORD, component: ChangePasswordComponent },
      { path: PATHS.ACCOUNT.CLOSE_ACCOUNT, component: CloseAccountComponent },
      { path: '', redirectTo: PATHS.ACCOUNT.PROFILE, pathMatch: 'full' },
    ]
  },
];

@NgModule( {
  imports: [ RouterModule.forChild( routes ) ],
  exports: [ RouterModule ],
} )
export class AccountRoutingModule { }
