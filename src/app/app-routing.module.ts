import { AuthGuard } from './auth/auth.guard';
import { SignComponent } from './auth/sign/sign.component';
import { PostCreateComponent } from './post/post-create/post-create.component';
import { PostListComponent } from './post/post-list/post-list.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  { path: '', component: PostListComponent },
  { path: 'create', component: PostCreateComponent, canActivate: [ AuthGuard]  },
  { path: 'edit/:postId', component: PostCreateComponent, canActivate: [ AuthGuard ] },
  { path: 'signin', component: SignComponent },
  { path: 'signup', component: SignComponent }
];

@NgModule( {
  declarations: [],
  imports: [ RouterModule.forRoot( routes ) ],
  exports: [ RouterModule ],
  providers: [ AuthGuard ]
} )
export class AppRoutingModule { }
