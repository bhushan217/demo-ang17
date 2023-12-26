import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsersService } from 'app/pages/object-key/data-access/ok.service';
import { Observable } from 'rxjs';

@Injectable()
export class ApiClientInterceptor implements HttpInterceptor {

  constructor(private auth: UsersService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  // Get the auth token from the service.
  const authToken = this.auth.getAuthorizationToken() ?? '-';

  // Clone the request and replace the original headers with
  // cloned headers, updated with the authorization.
  const authReq = req.clone({
    headers: req.headers.set('Authorization', authToken)
  });
  return next.handle(req);
};
}
