import { SignComponent } from './components/sign/sign.component';
import { PATHS } from 'src/app/shared/constants/globals';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  { path: PATHS.AUTH.SIGN_IN, component: SignComponent },
  { path: PATHS.AUTH.SIGN_UP, component: SignComponent },
  { path: '', redirectTo: PATHS.AUTH.SIGN_IN, pathMatch: 'full' },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class AuthRoutingModule { }
