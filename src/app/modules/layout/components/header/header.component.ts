import { Link } from './../../../../shared/models/link.model';
import { UserService } from './../../../../shared/services/user.service';
import { User } from './../../../../shared/models/auth.model';
import { AuthService } from 'src/app/shared/services';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { PATHS } from 'src/app/shared/constants/globals';

@Component( {
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [ './header.component.scss' ]
} )
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() menuLinks: Link[];
  @Output() linkClicked = new EventEmitter<Link>();
  @Output() menuClicked = new EventEmitter<boolean>();
  isAuthenticated: boolean;
  user: User;
  readonly PATHS = PATHS;
  private authListenerSub: Subscription;
  private userListenerSub: Subscription;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.isAuthenticated = !!this.authService.getToken(); // Get initial authenticated state
    this.authListenerSub = this.authService.getAuthListener()
      .subscribe( ( isAuth: boolean ) => {
        this.isAuthenticated = isAuth;
      } );

    this.user = this.userService.getUser();
    this.userListenerSub = this.userService.getUserListener()
      .subscribe( ( user: User ) => {
        this.user = { ...user };
        if ( user && user.imagePath ) {
          this.user.imagePath = user.imagePath.replace('users/', 'users/thumbnails/');
        }
      } );
  }

  onSignOut(): void {
    this.authService.signOut();
  }

  ngOnDestroy(): void {
    this.authListenerSub.unsubscribe();
    this.userListenerSub.unsubscribe();
  }
}
