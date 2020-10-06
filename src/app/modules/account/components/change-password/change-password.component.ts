import { PasswordData } from './../../../../shared/models/auth.model';
import { UserService } from 'src/app/shared/services/user.service';
import { matchFields } from 'src/app/shared/validators/match-fields.validator';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  form: FormGroup;
  isShowPassword: boolean[] = [];

  constructor( private userService: UserService ) { }

  ngOnInit(): void {
    this.form = new FormGroup( {
      password: new FormControl( null, {
        validators: [ Validators.required ]
      } ),
      newPassword: new FormControl( null, {
        validators: [ Validators.required ]
      } ),
      confirmNewPassword: new FormControl( null, {
        validators: [ Validators.required ]
      } )
    }, {
      validators: matchFields( 'newPassword', 'confirmNewPassword' )
    } );
  }

  onSave(): void {
    if ( this.form.invalid ) {
      return;
    }
    //this.form.disable();
    const passwordData: PasswordData = {
      password: this.form.value.password,
      newPassword: this.form.value.newPassword
    };
    this.userService.updateUserPassword( passwordData );
  }

}
