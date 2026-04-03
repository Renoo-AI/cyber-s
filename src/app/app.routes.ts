import {Routes, CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {Dashboard} from './dashboard';
import {ChallengeDetail} from './challenge-detail';
import {ChallengeLayout} from './challenge-layout';
import {GameStateService} from './game-state';

export const desktopOnlyGuard: CanActivateFn = () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    if (isMobile) {
        const router = inject(Router);
        const gameState = inject(GameStateService);
        gameState.byteMood.set('confused');
        gameState.byteMessage.set('Agent, this node requires a Full Desktop Terminal for exploitation.');
        return router.parseUrl('/');
    }
    return true;
};

export const routes: Routes = [
  {path: '', component: Dashboard},
  {
    path: 'challenge',
    component: ChallengeLayout,
    canActivate: [desktopOnlyGuard],
    children: [
      {path: ':id', component: ChallengeDetail}
    ]
  },
  {path: '**', redirectTo: ''}
];
