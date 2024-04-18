import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state): Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn$.pipe(
    map((isLoggedIn) => {
      if (isLoggedIn) {
        return true
      }
      router.navigateByUrl('/');
      return false;
    })
  )
};
