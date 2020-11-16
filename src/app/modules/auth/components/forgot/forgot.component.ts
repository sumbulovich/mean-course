import { EmailData } from 'src/app/shared/models';
import { AuthService, EmailService } from 'src/app/shared/services';
import { NgForm } from '@angular/forms';
import { PATHS } from 'src/app/shared/constants/globals';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent implements OnInit {
  readonly PATHS = PATHS;

  constructor(
    private emailService: EmailService
  ) { }

  ngOnInit(): void {
  }

  onSubmit( form: NgForm ): void {
    if ( form.invalid ) {
      return;
    }
    const email: EmailData = {
      to: form.value.email,
      subject: 'Confirmation Email',
      text: `Lorem ipsum dolor sit amet consectetur
        adipiscing elit ultricies auctor inceptos, potenti sociis
        consequat lacus congue pharetra odio diam vel tempus, mattis`
    };

    this.emailService.createEmailComponent( email );
  }
}
