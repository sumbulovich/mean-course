import { CommonModule } from '@angular/common';
import { MaterialModule } from './../material.module';
import { BaseDialogComponent } from './dialogs.component';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    BaseDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    BaseDialogComponent
  ]
})
export class DialogsModule { }
