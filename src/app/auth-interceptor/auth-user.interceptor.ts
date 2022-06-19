import {Injectable} from '@angular/core';
import {HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {UserService} from '../services/user.service';

@Injectable()
export class AuthUserInterceptor implements HttpInterceptor {

  constructor(private userService: UserService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.userService.getUserToken();
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + authToken)
    });
    return next.handle(authRequest);
  }
}
