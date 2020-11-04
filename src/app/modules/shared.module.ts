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
    ImagePickerComponent,
    FormComponent,
    CalcPipe
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
    ImagePickerComponent,
    FormComponent,
    CalcPipe
  ]
})
export class SharedModule { }
