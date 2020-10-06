import { Post } from 'src/app/shared/models';
import { AuthService, LoadingService, PostService } from 'src/app/shared/services';
import { PATHS } from 'src/app/shared/constants/globals';
import { ComponentType } from '@angular/cdk/portal';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostListComponent } from './post-list/post-list.component';

enum Mode { list, create }

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean;
  isLoading: boolean;
  isToolbar: boolean;
  modeTypes = Mode;
  mode: Mode;
  private loadingListenerSub: Subscription;
  private authListenerSub: Subscription;
  private postsListenerSub: Subscription;
  readonly PATHS = PATHS;

  constructor(
    private authService: AuthService,
    private loadingService: LoadingService,
    private postService: PostService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.loadingListenerSub = this.loadingService.getLoadingListener()
      .subscribe( ( isLoading: boolean ) => {
        this.isLoading = isLoading;
      } );

    this.isAuthenticated = !!this.authService.getToken(); // Get initial authenticated state
    this.authListenerSub = this.authService.getAuthListener()
      .subscribe( ( isAuth: boolean ) => {
        this.isAuthenticated = isAuth;
      } );

    this.postsListenerSub = this.postService.getPostsListener()
      .subscribe( ( posts: Post[] ) => {
        this.isToolbar = !!posts.length;
      } );
  }

  onRouterOutletActivate( activeComponent: ComponentType<any> ): void {
    this.mode = activeComponent instanceof PostListComponent ?
      this.modeTypes.list : this.modeTypes.create;

    // TODO: update when post.create have options
    this.isToolbar = this.mode === Mode.list;
  }

  ngOnDestroy(): void {
    this.loadingListenerSub.unsubscribe();
    this.authListenerSub.unsubscribe();

  }
}
