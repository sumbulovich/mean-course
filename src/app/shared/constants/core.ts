import { UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

export interface OnDeactivate {
  onDeactivate: () => Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;
}
