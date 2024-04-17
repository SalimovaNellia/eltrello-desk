import { HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { Observable } from 'rxjs';

export const AuthInterceptorService: HttpInterceptorFn = (req, next): Observable<HttpEvent<any>> => {
  const token = localStorage.getItem('token');
  req = req.clone({
    setHeaders: {
      Authorization: token ?? '',
    },
  });
  return next(req);
}

