import { PATHS } from 'src/app/shared/constants/globals';
import { HomeComponent } from './components/home.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  { path: PATHS.HOME, component: HomeComponent },
];

@NgModule( {
  imports: [ RouterModule.forChild( routes ) ],
  exports: [ RouterModule ],
} )
export class HomeRoutingModule { }
