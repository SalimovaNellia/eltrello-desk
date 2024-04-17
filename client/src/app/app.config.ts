import { provideHttpClient, withFetch, withInterceptors, } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { AuthInterceptorService } from './auth/services/auth-interceptor.service';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    provideHttpClient(withInterceptors([AuthInterceptorService])),
  ]
};
