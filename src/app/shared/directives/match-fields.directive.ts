import { matchFields } from '../validators/match-fields.validator';
import { Directive, Input } from '@angular/core';
import { ValidationErrors, FormGroup, NG_VALIDATORS, Validator } from '@angular/forms';

@Directive( {
  selector: '[appMatchFields]',
  providers: [ { provide: NG_VALIDATORS, useExisting: MatchFieldsDirective, multi: true } ]
} )
export class MatchFieldsDirective implements Validator {
  @Input( 'appMatchFields' ) matchFields: string[] = [];

  constructor() { }

  validate( formGroup: FormGroup ): ValidationErrors {
    return matchFields( this.matchFields[ 0 ], this.matchFields[ 1 ] )( formGroup );
  }
}
