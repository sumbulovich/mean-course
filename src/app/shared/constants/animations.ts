import { trigger, state, style, transition, animate } from '@angular/animations';
import { AnimationState } from './globals';

export const Animations = {
  fadeAnimation: trigger( 'fadeAnimation', [
    state( AnimationState.in, style( { opacity: 1 } ) ),
    state( AnimationState.out, style( { opacity: 0 } ) ),
    transition( AnimationState.out + '=>' + AnimationState.in, animate( 0 ) ),
    transition( AnimationState.in + '=>' + AnimationState.out, animate( 800 ) )
  ] )
};
