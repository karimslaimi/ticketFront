import { Injectable } from '@angular/core';
import getBrowserFingerprint from 'get-browser-fingerprint';

import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router, private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const fingerprint =  getBrowserFingerprint();

    if (this.authService.isAuthenticated()) {
      req = this.AddBrowserIdAndToken(req, fingerprint, this.authService.getJwtToken());
      req.headers.append('Content-Type', 'application/json');
    } else {
      this.router.navigate(["/login"]);
    }
    return next.handle(req).pipe(catchError(error => {
      if(error.status == 401 && error.statusText == 'Unauthorized'){
        localStorage.clear()
        window.location.reload();
      }else{
        return throwError(() => error);
      }

    }))
  }
  AddBrowserIdAndToken(request: HttpRequest<any>, fingerprint: string, token: string) {
    debugger
    let userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if(!userInfo){userInfo = {user_id:null}}
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'fingerprint': String(fingerprint),
        'userId':String(userInfo.user_id)
      }
    });
  }
  AddBrowserId(request: HttpRequest<any>, fingerprint: string) {
    return request.clone({
      setHeaders: {
        'fingerprint': String(fingerprint)
      }
    });
  }


}
