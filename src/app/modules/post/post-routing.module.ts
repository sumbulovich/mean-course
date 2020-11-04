import { PATHS } from 'src/app/shared/constants/globals';
import { PostComponent } from './components/post.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { AuthGuard } from 'src/app/shared/guards';
import { Routes, RouterModule } from '@angular/router';
import { PostCreateComponent } from './components/post-create/post-create.component';
import { NgModule } from '@angular/core';


const routes: Routes = [
  { path: '', component: PostComponent, children: [
    { path: PATHS.POSTS.LIST, component: PostListComponent },
    { path: PATHS.POSTS.CREATE, component: PostCreateComponent, canActivate: [ AuthGuard ] },
    { path: PATHS.POSTS.EDIT + '/:postId', component: PostCreateComponent, canActivate: [ AuthGuard ] },
  ] }
];

@NgModule( {
  imports: [ RouterModule.forChild( routes ) ],
  exports: [ RouterModule ],
  providers: [ AuthGuard ]
} )
export class PostRoutingModule { }
