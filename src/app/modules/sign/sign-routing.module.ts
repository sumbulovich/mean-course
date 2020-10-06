import { PATHS } from 'src/app/shared/constants/globals';
import { SignComponent } from './components/sign/sign.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  { path: PATHS.AUTH.SIGN_IN, component: SignComponent },
  { path: PATHS.AUTH.SIGN_UP, component: SignComponent },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class SignRoutingModule { }
