import { ComponentType } from '@angular/cdk/portal';
import { AuthService, LoadingService } from './../../../shared/services';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PATHS } from 'src/app/shared/constants/constants';
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
  modeTypes = Mode;
  mode: Mode;
  private authListenerSubs: Subscription;
  readonly PATHS = PATHS;

  constructor(
    private authService: AuthService,
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.loadingService.getLoadingListener().subscribe( ( isLoading: boolean ) => {
      this.isLoading = isLoading;
    } );
    this.isAuthenticated = !!this.authService.getToken(); // Get initial authenticated state
    this.authListenerSubs = this.authService.getAuthListener()
      .subscribe( ( isAuth: boolean ) => {
        this.isAuthenticated = isAuth;
      } );
  }

  onRouterOutletActivate( activeComponent: ComponentType<any> ): void {
    this.mode = activeComponent instanceof PostListComponent ?
      this.modeTypes.list : this.modeTypes.create;
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }
}
