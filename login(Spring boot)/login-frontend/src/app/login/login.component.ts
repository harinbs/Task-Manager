import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onLogin() {
    this.authService.login(this.username, this.password)
      .subscribe(
        (isAuthenticated: boolean) => {
          if (isAuthenticated) {
            this.router.navigate(['/home']);
          } else {
            this.errorMessage = 'Invalid username or password';
          }
        },
        error => {
          this.errorMessage = 'An error occurred. Please try again.';
        }
      );
  }
}
