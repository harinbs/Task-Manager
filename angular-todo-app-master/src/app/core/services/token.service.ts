import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { constants } from '../constants/constants';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private currentToken = new BehaviorSubject<string | null>(this.getToken());

  setToken(token: string) {
    localStorage.setItem(constants.CURRENT_TOKEN, token);
    this.currentToken.next(token);
  }

  getToken(): string | null {
    return localStorage.getItem(constants.CURRENT_TOKEN);
  }

  removeToken() {
    localStorage.removeItem(constants.CURRENT_TOKEN);
    this.currentToken.next(null);
  }

  get isAuthentication() {
    return this.currentToken.asObservable();
  }
}