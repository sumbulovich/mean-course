import { Subscription } from 'rxjs';
import { LoadingService, CodeService, UserService } from 'src/app/shared/services';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PASSWORD_PATTERN } from 'src/app/shared/constants/globals';
import { NgForm } from '@angular/forms';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit, OnDestroy {
  @ViewChild( 'form' ) private form: NgForm;
  isShowPassword: boolean[] = [];
  isSubmit: boolean;
  isValid: boolean;
  passwordPattern = new RegExp( PASSWORD_PATTERN);
  private codeId: string;
  private codeListenerSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private codeService: CodeService
  ) {
    this.route.paramMap.subscribe( ( paramMap: ParamMap ) => {
      this.codeId = paramMap.get( 'codeId' );
      if ( this.codeId ) {
        this.loadingService.setLoadingListener( true );
      }
    } );
  }

  ngOnInit(): void {
    if ( this.codeId ) {
      this.codeService.validateCode( this.codeId );
      this.codeListenerSub = this.codeService.getCodeListener()
        .subscribe( ( isValid ) => {
          if ( this.isValid ) {
            if ( !isValid ) {
              this.form.control.enable();
            }
            this.isSubmit = isValid;
            return;
          }
          this.isValid = isValid;
          this.loadingService.setLoadingListener( false );
        } );
    }
  }

  onSubmit( form: NgForm ): void {
    if ( form.invalid ) {
      return;
    }
    this.form.control.disable();
    this.codeService.resetPassword( this.codeId, form.value.password );
  }

  ngOnDestroy(): void {
    this.codeListenerSub.unsubscribe();
  }
}
