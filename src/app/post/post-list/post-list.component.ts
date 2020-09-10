import { User } from './../../auth/auth.model';
import { UserService } from './../../auth/services/user.service';
import { AuthService } from './../../auth/services/auth.service';
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { PostService } from './../post.service';
import { Post } from './../post.model';
import { PATHS } from 'src/app/constants';

@Component( {
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: [ './post-list.component.scss' ]
} )
export class PostListComponent implements OnInit, OnDestroy {
  @ViewChild( 'paginator' ) paginator: MatPaginator;
  posts: Post[] = [];
  isLoading = false;
  pageData: PageEvent;
  userId: string;
  readonly PATHS = PATHS;
  private resetPagination: boolean;
  private postsListenerSub: Subscription;
  private authListenerSub: Subscription;

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private router: Router
  ) {
    const navigationState = this.router.getCurrentNavigation().extras.state;
    this.resetPagination = navigationState && navigationState.resetPagination;
   }

  ngOnInit(): void {
    this.isLoading = true;
    if ( !this.resetPagination ) {
      this.pageData = this.postService.getPageData();
    }
    this.postService.getPosts( this.pageData );
    this.postsListenerSub = this.postService.getPostUpdatedListener()
      .subscribe( ( posts: Post[] ) => {
        this.pageData = this.postService.getPageData();
        this.paginator.pageIndex = this.pageData.pageIndex;
        if ( this.pageData.length && !posts.length ) {
          this.paginator.previousPage(); // .previousPage is a method of MatPaginator
          return;
        } // If we are on the last page and there is not any post
        this.posts = posts;
        this.isLoading = false;
      } );
    this.userId = this.authService.getUserId();
    this.authListenerSub = this.authService.getAuthListener().subscribe( ( isAuth: boolean ) => {
      this.userId = isAuth ? this.authService.getUserId() : null;
    } );
  }

  onChangePage( pageData: PageEvent ): void {
    this.isLoading = true;
    this.pageData = pageData;
    this.postService.getPosts( this.pageData );
  }

  onDelete( postId: string ): void {
    this.isLoading = true;
    this.postService.deletePost( postId, this.pageData );
  }

  ngOnDestroy(): void {
    this.postsListenerSub.unsubscribe();
    this.authListenerSub.unsubscribe();
  }
}
