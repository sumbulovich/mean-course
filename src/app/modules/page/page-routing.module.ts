import { PATHS } from 'src/app/shared/constants/globals';
import { ErrorComponent } from './components/error/error.component';
import { HomeComponent } from './components/home/home.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  { path: PATHS.HOME, component: HomeComponent },
  { path: PATHS.NOT_FOUND, component: ErrorComponent }
];

@NgModule( {
  imports: [ RouterModule.forChild( routes ) ],
  exports: [ RouterModule ],
} )
export class PageRoutingModule { }
