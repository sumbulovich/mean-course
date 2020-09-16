import { TemplateRef } from '@angular/core';

export class DialogData {
  title: string;
  content: string;
  confirmButton: DialogButton = { text: 'Accept', color: 'primary' };
  cancelButton: DialogButton = { text: 'Cancel' };
}

export interface DialogButton {
  text: string;
  color?: string;
}
