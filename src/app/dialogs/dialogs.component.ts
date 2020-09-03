import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component( {
  templateUrl: './base.html',
} )
export class BaseDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<BaseDialogComponent>,
    @Inject( MAT_DIALOG_DATA ) public data: any ) { }

  onConfirm(): void {
    this.dialogRef.close( true );
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
