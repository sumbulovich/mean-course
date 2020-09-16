import { Directive } from '@angular/core';
import { NgModel } from '@angular/forms';

@Directive({
  selector: '[appResetField]'
})
export class ResetFieldDirective {

  constructor( public control: NgModel ) { }
}
