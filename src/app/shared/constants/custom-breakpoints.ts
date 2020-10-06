import { BREAKPOINTS, DEFAULT_BREAKPOINTS, BreakPoint } from '@angular/flex-layout';

const CUSTOM = {
  'xs': 'screen and (max-width: 566.9px)',
  'gt-xs': 'screen and (min-width: 567px)',
  'sm': 'screen and (min-width: 568px) and (max-width: 767.9px)',
  'gt-sm': 'screen and (min-width: 768px)',
  'md': 'screen and (min-width: 768px) and (max-width: 991.9px)',
  'gt-md': 'screen and (min-width: 992px)',
  'lg': 'screen and (min-width: 992px) and (max-width: 1199.9px)',
  'gt-lg': 'screen and (min-width: 1200px)',
  'xl': 'screen and (min-width: 1200px)',
};

function updateMediaQuery( it: BreakPoint ): BreakPoint {
  const mq = CUSTOM[ it.alias ];
  if ( !!mq ) {
    it.mediaQuery = mq;
  }
  return it;
}

const CUSTOM_BREAKPOINTS: BreakPoint[] = DEFAULT_BREAKPOINTS.map( ( it: BreakPoint ) => updateMediaQuery( it ) );

export const CustomBreakPointsProvider = {
  provide: BREAKPOINTS,
  useValue: CUSTOM_BREAKPOINTS,
  multi: true
}; // multi as true adds a new Interceptor instead to override the existing ones
