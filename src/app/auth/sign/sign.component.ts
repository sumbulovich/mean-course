import { AuthService } from './../auth.service';
import { PATHS } from './../../constants';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthData } from '../auth.model';

enum Mode {
  signIn = 'Sign In',
  signUp = 'Sign Up',
  'Sign In' = signIn,
  'Sign Up' = signUp
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

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.mode = this.router.url === PATHS.SIGN_IN ? Mode.signIn : Mode.signUp;
  }

  onSubmit( form: NgForm ): void {
    if ( form.invalid ) {
      return;
    }
    this.isLoading = true;
    const authData: AuthData = { email: form.value.email, password: form.value.password };
    if ( this.mode === Mode.signIn ) {
      this.authService.signIn( authData );
    } else {
      this.authService.addUser( authData );
    }
  }
}
