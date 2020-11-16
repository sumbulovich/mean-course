import { take } from 'rxjs/operators';
import { EmailComponent } from 'src/app/shared/components/email/email.component';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { ComponentFactoryResolver, ComponentRef, Injectable, Type, ViewContainerRef } from '@angular/core';
import { EmailData } from '../models';

const BACKEND_URL = environment.apiUrl + '/users/';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private emailListener = new Subject<boolean>();
  private emailContainer: ViewContainerRef;

  constructor(
    private http: HttpClient,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  getEmailListener(): Observable<boolean> {
    return this.emailListener.asObservable();
  }

  setEmailContainer( emailContainer: ViewContainerRef ): void {
    this.emailContainer = emailContainer;
  }

  sendEmail( email: EmailData ): void {
    this.http.post<{ message: string }>( BACKEND_URL + 'email', email )
      .subscribe( responseData => {
        console.log(responseData);
        this.emailListener.next( true );
      } );
  }

  createEmailComponent( email: EmailData ): void {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory( EmailComponent );
    const component = this.emailContainer.createComponent( componentFactory ).instance;
    // const injector = Injector.create( { providers: [ { provide: EMAIL_INJECTION_TOKEN, useValue: emailData } ] } );
    component.email = email;
    component.sendEmail.pipe( take( 1 ) ).subscribe( ( result: EmailData ) => {
      this.sendEmail( result );
      this.emailContainer.clear();
    } );
  }
}
