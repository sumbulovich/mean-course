import { PostComponent } from './components/post.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PostCreateComponent } from './components/post-create/post-create.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { SharedModule } from './../shared.module';
import { PostRoutingModule } from './post-routing.module';
import { NgModule } from '@angular/core';
import { Ng2ImgMaxModule } from 'ng2-img-max';

@NgModule({
  declarations: [
    PostComponent,
    PostListComponent,
    PostCreateComponent
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    PostRoutingModule,
    Ng2ImgMaxModule
  ]
})
export class PostModule { }
