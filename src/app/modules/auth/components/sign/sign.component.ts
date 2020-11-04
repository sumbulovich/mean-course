import { ResetFieldDirective } from 'src/app/shared/directives';
import { User, AuthData } from 'src/app/shared/models';
import { AuthService } from 'src/app/shared/services';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { PATHS , PASSWORD_PATTERN} from 'src/app/shared/constants/globals';

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
  @ViewChild( 'form' ) private form: NgForm;
  @ViewChild( 'acceptCheckbox' ) private acceptCheckbox: MatCheckbox;
  @ViewChildren( ResetFieldDirective ) private resetFieldDirectives: QueryList<ResetFieldDirective>;
  modeTypes = Mode;
  mode: Mode;
  passwordPattern: RegExp;
  isShowPassword: boolean[] = [];
  readonly PATHS = PATHS;
  private authListenerSub: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const pathSegment: string = this.router.url.split( '/' ).pop();
    this.mode = pathSegment === PATHS.AUTH.SIGN_UP ? Mode.signUp : Mode.signIn;
    if ( this.mode === Mode.signUp ) {
      this.passwordPattern = new RegExp( PASSWORD_PATTERN );
    }
    this.authListenerSub = this.authService.getAuthListener()
      .subscribe( () => {
        this.resetFieldDirectives.forEach( ( resetFieldDirective: ResetFieldDirective ) => {
          this.form.getControl( resetFieldDirective.control ).reset();
        });
        this.form.resetForm( this.form.value );
        this.form.control.enable();
      } );
  }

  onSubmit( form: NgForm ): void {
    if ( form.invalid ) {
      if ( this.mode === Mode.signUp && !this.acceptCheckbox.checked ) {
        this.acceptCheckbox.focus();
      }
      return;
    }
    form.control.disable();
    if ( this.mode === Mode.signUp ) {
      const user: User = new User( null, form.value.firstName, form.value.lastName, form.value.email, null, form.value.password );
      this.authService.signUp( user );
    } else {
      const authData: AuthData = { email: form.value.email, password: form.value.password, remember: form.value.remember };
      this.authService.signIn( authData );
    }
  }

  ngOnDestroy(): void {
    this.authListenerSub.unsubscribe();
  }
}
