import { PASSWORD_PATTERN } from './../../../../shared/constants/globals';
import { PasswordData, User } from './../../../../shared/models/auth.model';
import { UserService } from 'src/app/shared/services/user.service';
import { matchFields } from 'src/app/shared/validators/match-fields.validator';
import { FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  @ViewChild( 'formDirective' ) private formDirective: NgForm;
  form: FormGroup;
  isShowPassword: boolean[] = [];

  constructor( private userService: UserService ) { }

  ngOnInit(): void {
    this.form = new FormGroup( {
      password: new FormControl( null, {
        validators: [ Validators.required ]
      } ),
      newPassword: new FormControl( null, {
        validators: [
          // Validators.required,
          Validators.minLength( 8 ),
          Validators.maxLength( 32 ),
          Validators.pattern( new RegExp( PASSWORD_PATTERN ) )
        ]
      } ),
      confirmNewPassword: new FormControl( null, {
        validators: [ Validators.required ]
      } )
    }, {
      validators: [
        matchFields( 'password', 'newPassword', true ),
        matchFields( 'newPassword', 'confirmNewPassword' ),
      ]
    } );

    this.userService.getUserListener().subscribe( ( user: User ) => {
      this.form.enable();
      if ( !user ) {
        this.form.get( 'password' ).reset();
        return;
      }
      this.formDirective.resetForm();
    } );
  }

  onSave(): void {
    console.log(this.form.get('newPassword').errors);
    if ( this.form.invalid ) {
      return;
    }
    this.form.disable();
    const passwordData: PasswordData = {
      password: this.form.value.password,
      newPassword: this.form.value.newPassword
    };
    this.userService.updateUserPassword( passwordData );
  }
}
