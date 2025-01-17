import { ResetComponent } from './components/reset/reset.component';
import { AuthComponent } from './components/auth.component';
import { ForgotComponent } from './components/forgot/forgot.component';
import { SignComponent } from './components/sign/sign.component';
import { PATHS } from 'src/app/shared/constants/globals';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  { path: '', component: AuthComponent, children: [
    { path: PATHS.AUTH.SIGN_IN, component: SignComponent },
    { path: PATHS.AUTH.SIGN_UP, component: SignComponent },
    { path: PATHS.AUTH.FORGOT_PSW, component: ForgotComponent },
    { path: PATHS.AUTH.RESET_PSW + '/:codeId', component: ResetComponent },
    { path: '', redirectTo: PATHS.AUTH.SIGN_IN, pathMatch: 'full' }
  ] }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class AuthRoutingModule { }
