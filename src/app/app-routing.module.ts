import { AuthGuard, NoAuthGuard } from 'src/app/shared/guards';
import { PATHS } from 'src/app/shared/constants/globals';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: PATHS.HOME,
    loadChildren: () => import( './modules/page/page.module' ).then( m => m.PageModule )
  },
  {
    path: PATHS.ACCOUNT.ROOT,
    loadChildren: () => import( './modules/account/account.module' ).then( m => m.AccountModule ),
    canLoad: [ AuthGuard ]
  },
  {
    path: PATHS.AUTH.ROOT,
    loadChildren: () => import( './modules/auth/auth.module' ).then( m => m.AuthModule ),
    canLoad: [ NoAuthGuard ]
  },
  {
    path: PATHS.POSTS.ROOT,
    loadChildren: () => import( './modules/post/post.module' ).then( m => m.PostModule )
  },
  { path: '**', redirectTo: PATHS.NOT_FOUND }
]; // Lazy loading

@NgModule( {
  declarations: [],
  imports: [
    RouterModule.forRoot( routes ),
  ],
  exports: [ RouterModule ]
} )
export class AppRoutingModule { }
