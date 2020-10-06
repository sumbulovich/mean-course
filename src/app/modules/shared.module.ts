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
    FormComponent
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
    FormComponent
  ]
})
export class SharedModule { }
