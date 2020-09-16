import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component( {
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
} )
export class DialogComponent {
  constructor(
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject( MAT_DIALOG_DATA ) public data: any
  ) { }

  onConfirm(): void {
    this.dialogRef.close( true );
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
