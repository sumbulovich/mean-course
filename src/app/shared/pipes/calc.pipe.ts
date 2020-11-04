import { Pipe, PipeTransform } from '@angular/core';

@Pipe( {
  name: 'calc'
} )
export class CalcPipe implements PipeTransform {

  transform( value: number, percent = 100 ): string {
    return 'calc(' + percent + '% - ' + value + 'px)';
  }
}
