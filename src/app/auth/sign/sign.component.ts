import { Subscription } from 'rxjs';
import { User, AuthData } from './../auth.model';
import { AuthService } from './../services/auth.service';
import { PATHS } from './../../constants';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';

enum Mode {
  signIn = 'Log in',
  signUp = 'Sign up',
  'Log in' = signIn,
  'Sign up' = signUp
}

@Component( {
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: [ './sign.component.scss' ]
} )
export class SignComponent implements OnInit, OnDestroy {
  @ViewChild( 'acceptCheckbox' ) acceptCheckbox: MatCheckbox;
  isLoading = false;
  modeTypes = Mode;
  mode: Mode;
  passwordPattern: RegExp;
  hidePassword = true;
  hideConfirmPassword = true;
  readonly PATHS = PATHS;
  private authListenerSub: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.mode = this.router.url === PATHS.AUTH.SIGN_UP ? Mode.signUp : Mode.signIn;
    if ( this.mode === Mode.signUp ) {
      this.passwordPattern = new RegExp( '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$' );
    }
    this.authListenerSub = this.authService.getAuthListener()
      .subscribe( ( isAuth: boolean ) => {
        this.isLoading = false;
      } );
  }

  onSubmit( form: NgForm ): void {
    if ( form.invalid ) {
      if ( this.mode === Mode.signUp && !this.acceptCheckbox.checked ) {
        this.acceptCheckbox.focus();
      }
      return;
    }
    this.isLoading = true;
    if ( this.mode === Mode.signUp ) {
      const user: User = new User( null, form.value.firstName, form.value.lastName, form.value.email, null, form.value.password );
      this.authService.signUp( user );
    } else {
      const authData: AuthData = { email: form.value.email, password: form.value.password };
      this.authService.signIn( authData );
    }
  }

  ngOnDestroy(): void {
    this.authListenerSub.unsubscribe();
  }
}
