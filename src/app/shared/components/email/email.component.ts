import { EmailService } from 'src/app/shared/services';
import { Component, OnInit, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { EmailData } from '../../models';

// export const EMAIL_INJECTION_TOKEN = new InjectionToken<string>( 'emailData' );

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit {
  @Input() email: EmailData;
  @Output() sendEmail = new EventEmitter<EmailData>();

  constructor(
    private elRef: ElementRef,
  ) {}
  // this.emailData = this.injector.get<any>( EMAIL_INJECTION_TOKEN );
  // @Inject( EMAIL_INJECTION_TOKEN ) public emailData: any

  ngOnInit(): void {
    setTimeout( () => {
      this.email.html = this.elRef.nativeElement.innerHTML;
      this.sendEmail.next( this.email );
    } );
  }
}
