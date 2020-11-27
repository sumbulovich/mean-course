import { AuthService, PostService, LoadingService } from 'src/app/shared/services';
import { Post } from 'src/app/shared/models';
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { PATHS } from 'src/app/shared/constants/globals';
import { MatAccordion } from '@angular/material/expansion';

enum Pagination {
  first = 0,
  last = -1
}

@Component( {
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: [ './post-list.component.scss' ]
} )
export class PostListComponent implements OnInit, OnDestroy {
  @ViewChild( 'paginator' ) paginator: MatPaginator;
  isAuthenticated: boolean;
  posts: Post[] = [];
  pageData = new PageEvent();
  userId: string;
  readonly PATHS = PATHS;
  private pagination: string;
  private postsListenerSub: Subscription;
  private postListenerSub: Subscription;
  private authListenerSub: Subscription;

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private router: Router,
    private loadingService: LoadingService
  ) {
    const navigationState = this.router.getCurrentNavigation().extras.state;
    this.pagination = navigationState && navigationState.pagination;
    this.loadingService.setLoadingListener( true );
   }

  ngOnInit(): void {
    this.isAuthenticated = !!this.authService.getToken(); // Get initial authenticated state
    this.authListenerSub = this.authService.getAuthListener()
      .subscribe( ( isAuth: boolean ) => {
        this.isAuthenticated = isAuth;
      } );
    this.pageData = this.postService.getPageData();
    if ( this.pagination ) {
      this.pageData.pageIndex = Pagination[ this.pagination ];
    }
    this.postService.getPosts( this.pageData );
    this.postsListenerSub = this.postService.getPostsListener()
      .subscribe( ( posts: Post[] ) => {
        this.pageData = this.postService.getPageData();
        this.paginator.pageIndex = this.pageData.pageIndex;
        if ( this.pageData.length && !posts.length ) {
          this.paginator.previousPage(); // .previousPage is a method of MatPaginator
          return;
        } // If we are on the last page and there is not any post
        this.posts = posts.map( ( post: Post ) => {
          if ( post.imagePath ) {
            post.imagePath = post.imagePath.replace('posts/', 'posts/thumbnails/');
          }
          return post;
        } );
        this.loadingService.setLoadingListener( false );
      } );

    this.userId = this.authService.getUserId();
    this.authListenerSub = this.authService.getAuthListener().subscribe( ( isAuth: boolean ) => {
      this.userId = isAuth ? this.authService.getUserId() : null;
    } );
    this.postListenerSub = this.postService.getPostListener()
      .subscribe( () => this.loadingService.setLoadingListener( false ) );
  }

  onChangePage( pageData: PageEvent ): void {
    this.loadingService.setLoadingListener( true );
    this.postService.getPosts( pageData );
    this.pageData = pageData;
  }

  onDelete( postId: string ): void {
    this.loadingService.setLoadingListener( true );
    this.postService.deletePost( postId, this.pageData );
  }

  ngOnDestroy(): void {
    this.postsListenerSub.unsubscribe();
    this.postListenerSub.unsubscribe();
    this.authListenerSub.unsubscribe();
  }
}
