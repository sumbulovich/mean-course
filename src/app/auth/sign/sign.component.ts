import { UserService } from './../services/user.service';
import { User } from './../auth.model';
import { AuthService } from './../services/auth.service';
import { PATHS } from './../../constants';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthData } from '../auth.model';
import { MatCheckbox } from '@angular/material/checkbox';

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
export class SignComponent implements OnInit {
  isLoading = false;
  modeTypes = Mode;
  mode: Mode;
  passwordPattern: RegExp;
  hidePassword = true;
  hideConfirmPassword = true;
  @ViewChild( 'acceptCheckbox' ) acceptCheckbox: MatCheckbox;
  readonly PATHS = PATHS;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.mode = this.router.url === PATHS.AUTH.SIGN_UP ? Mode.signUp : Mode.signIn;
    if ( this.mode === Mode.signUp ) {
      this.passwordPattern = new RegExp( '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$' );
    }
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
      const user: User = new User( null, form.value.firstName, form.value.lastName, form.value.email, form.value.password );
      this.userService.addUser( user ).subscribe( ( isAdded: boolean ) => {
        if ( isAdded ) {
          this.authService.signIn( { email: user.email, password: user.password } as AuthData );
        }
      } );
    } else {
      this.authService.signIn( { email: form.value.email, password: form.value.password } as AuthData );
    }
  }
}
