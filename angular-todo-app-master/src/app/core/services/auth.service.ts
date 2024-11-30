import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ILogin, ILoginResponse, IRegister } from '../models/auth.mode';
import { apiEndpoint } from '../constants/constants';
import { map } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router // Inject Router
  ) {}

  onLogin(data: ILogin) {
    return this.http
      .post<ILoginResponse>(`${apiEndpoint.AuthEndpoint.login}`, data)
      .pipe(
        map((response) => {
          if (response) {
            this.tokenService.setToken(response.token);
          }
          return response;
        })
      );
  }

  onRegister(data: IRegister) {
    return this.http
      .post<{ msg: string }>(`${apiEndpoint.AuthEndpoint.register}`, data)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  onLogout() {
    this.tokenService.removeToken();
    this.router.navigate(['/login']); // Navigate to login page
  }

  getUsername(): string | null {
    const token = this.tokenService.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.user.name;
    }
    return null;
  }
}