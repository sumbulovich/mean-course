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
export class CodeService {
  private emailListener = new Subject<boolean>();
  private codeListener = new Subject<boolean>();
  private emailContainer: ViewContainerRef;

  constructor(
    private http: HttpClient,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  getEmailListener(): Observable<boolean> {
    return this.emailListener.asObservable();
  }

  getCodeListener(): Observable<boolean> {
    return this.codeListener.asObservable();
  }

  setEmailContainer( emailContainer: ViewContainerRef ): void {
    this.emailContainer = emailContainer;
  }

  sendEmail( email: EmailData ): void {
    this.http.post<{ message: string }>( BACKEND_URL + 'email', email )
      .subscribe( responseData => {
        console.log( responseData.message );
        this.emailListener.next( true );
      },
      error => this.emailListener.next( false ) );
  }

  validateCode( codeId: string ): void {
    this.http.get<{ message: string }>( BACKEND_URL + 'code/' + codeId )
      .subscribe( responseData => {
        console.log( responseData.message );
        this.codeListener.next( true );
      },
      error => this.codeListener.next( false ) );
  }

  resetPassword( codeId: string, newPassword: string ): void {
    console.log('newPassword', newPassword);
    this.http.put<{ message: string }>( BACKEND_URL + 'code/' + codeId, { newPassword } )
      .subscribe( responseData => {
        console.log( responseData.message );
        this.codeListener.next( true );
      },
      error => this.codeListener.next( false ) );
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
