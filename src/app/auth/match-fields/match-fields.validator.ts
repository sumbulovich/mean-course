import { FormGroup } from '@angular/forms';

// custom validator to check that two fields match
export const matchFields = ( controlName: string, matchingControlName: string ) => {
  return ( formGroup: FormGroup ) => {
    const control = formGroup.controls[ controlName ];
    const matchingControl = formGroup.controls[ matchingControlName ];

    // return null if controls haven't initialized yet
    if ( !control || !matchingControl ) {
      return null;
    }

    // return null if another validator has already found an error on the matchingControl
    if ( matchingControl.errors && !matchingControl.errors.misMatch ) {
      return null;
    }

    // set error on matchingControl if validation fails
    if ( control.value !== matchingControl.value ) {
      matchingControl.setErrors( { misMatch: true } );
    } else {
      matchingControl.setErrors( null );
    }
  };
};