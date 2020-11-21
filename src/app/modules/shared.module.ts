import { SanitizeHtmlPipe } from './../shared/pipes/sanitize-html.pipe';
import { EmailComponent } from './../shared/components/email/email.component';
import {
  MatchFieldsDirective,
  ResetFieldDirective,
} from 'src/app/shared/directives';
import { CalcPipe } from 'src/app/shared/pipes/calc.pipe';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import {
  FormComponent,
  ImagePickerComponent,
  DialogComponent,
  LoadingComponent
} from 'src/app/shared/components';

@NgModule({
  declarations: [
    LoadingComponent,
    DialogComponent,
    EmailComponent,
    ImagePickerComponent,
    FormComponent,
    CalcPipe,
    SanitizeHtmlPipe,
    MatchFieldsDirective,
    ResetFieldDirective
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule
  ],
  exports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    LoadingComponent,
    DialogComponent,
    EmailComponent,
    ImagePickerComponent,
    FormComponent,
    CalcPipe,
    SanitizeHtmlPipe,
    MatchFieldsDirective,
    ResetFieldDirective
  ]
})
export class SharedModule { }
