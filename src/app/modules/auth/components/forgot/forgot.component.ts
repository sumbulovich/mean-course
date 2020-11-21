import { EmailData } from 'src/app/shared/models';
import { CodeService } from 'src/app/shared/services';
import { NgForm } from '@angular/forms';
import { PATHS } from 'src/app/shared/constants/globals';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent implements OnInit {
  @ViewChild( 'form' ) private form: NgForm;
  isSubmit: boolean;
  readonly PATHS = PATHS;

  constructor( private codeService: CodeService ) { }

  ngOnInit(): void {
    this.codeService.getEmailListener()
      .subscribe( ( isSend: boolean ) => {
        if ( !isSend ) {
          this.form.control.enable();
        }
        this.isSubmit = isSend;
      } );
  }

  onSubmit( form: NgForm ): void {
    if ( form.invalid ) {
      return;
    }
    form.control.disable();
    const email: EmailData = {
      to: form.value.email,
      subject: 'Password Reset',
      html: `
        <p>Hi #name#,</p>
        <p>We've received a request to reset your password.</p>
        <form action="http://localhost:4200/auth/reset-password/#code#">
          <input type="submit" value="Go to Google" />
        </form>
        <p>Copyable link: <a href="http://localhost:4200/auth/reset-password/#code#">
          http://localhost:4200/auth/reset-password/#code#
        </a>
      `
    };
    this.codeService.createEmailComponent( email );
  }
}
