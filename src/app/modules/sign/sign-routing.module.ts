import { SignComponent } from './components/sign/sign.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  { path: 'signin', component: SignComponent },
  { path: 'signup', component: SignComponent }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class SignRoutingModule { }
