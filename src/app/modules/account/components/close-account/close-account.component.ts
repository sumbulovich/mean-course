import { DialogData } from './../../../../shared/models/dialog.model';
import { DialogComponent } from './../../../../shared/components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/shared/services';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-close-account',
  templateUrl: './close-account.component.html',
  styleUrls: ['./close-account.component.scss']
})
export class CloseAccountComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private dialogService: MatDialog
  ) { }

  ngOnInit(): void {
  }

  onClick(): void {
    const dialogRef = this.dialogService.open( DialogComponent, {
      data: {
        title: '<span class="text-danger mat-warn">Close Account</span>',
        content: `Are you sure you want to close your account?
          <p>This action is <strong>permanent</strong> and cannot be undone.</p>`,
        cancelButton: { text: 'Cancel' },
        confirmButton: { text: 'Close Account', color: 'warn' }
      } as DialogData,
      disableClose: true // Whether the user can use escape or clicking on the backdrop to close the dialog.
    } );

    dialogRef.afterClosed().subscribe( ( isConfirmButton: boolean ) => {
      if ( !isConfirmButton ) {
        return;
      }
      this.authService.closeAccount();
    } );
  }
}
