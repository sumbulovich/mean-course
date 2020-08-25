import { AuthService } from './../../auth/auth.service';
import { Router, NavigationStart } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { PostService } from './../post.service';
import { Post } from './../post.model';
import { filter, take } from 'rxjs/operators';
import { PATHS } from 'src/app/constants';

@Component( {
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: [ './post-list.component.scss' ]
} )
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  pageData: PageEvent;
  isAuthenticated: boolean;
  @ViewChild( 'paginator' ) paginator: MatPaginator;
  readonly PATHS = PATHS;
  private resetPagination: boolean;
  private postsListenerSubs: Subscription;
  private authListenerSubs: Subscription;

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
    this.pageData = this.postService.getPageData();
    if ( this.resetPagination || !this.pageData ) {
      this.pageData = { pageSize: 5, pageIndex: 0, length: 0 };
    }
    this.postService.getPosts( this.pageData );
    this.postsListenerSubs = this.postService.getPostUpdatedListener()
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
    this.isAuthenticated = !!this.authService.getToken(); // Get initial authenticated state
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe( ( isAuthenticated: boolean ) => {
        this.isAuthenticated = isAuthenticated;
      } );
  }

  onChangePage( pageData: PageEvent ): void {
    this.isLoading = true;
    this.pageData = pageData;
    this.postService.getPosts( this.pageData );
  }

  ngOnDestroy(): void {
    if ( this.postsListenerSubs ) {
      this.postsListenerSubs.unsubscribe();
    }
    if ( this.authListenerSubs ) {
      this.authListenerSubs.unsubscribe();
    }
  }

  onDelete( postId: string ): void {
    this.isLoading = true;
    this.postService.deletePost( postId, this.pageData );
  }
}
