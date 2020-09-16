import { CustomBreakPointsProvider } from './../shared/constants/custom-breakpoints';
import { DialogComponent } from './../shared/components/dialog/dialog.component';
import { LoadingComponent } from './../shared/components/loading/loading.component';
import { FlexLayoutModule, BREAKPOINTS, DEFAULT_BREAKPOINTS } from '@angular/flex-layout';
import { MaterialModule } from './material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    LoadingComponent,
    DialogComponent
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
    DialogComponent
  ],
  providers: [
    // CustomBreakPointsProvider
  ]
})
export class SharedModule { }
