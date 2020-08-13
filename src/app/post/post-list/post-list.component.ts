import { PostService } from './../post.service';
import { Post } from './../post.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component( {
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: [ './post-list.component.scss' ]
} )
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  private postsSub: Subscription;

  constructor( private postService: PostService ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPosts();
    this.postsSub = this.postService.getPostUpdatedListener()
      .subscribe( ( post: Post[] ) => {
        this.posts = post;
        this.isLoading = false;
      } );
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }

  onDelete( postId: string ): void {
    this.postService.deletePost( postId );
  }
}
