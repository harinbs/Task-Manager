import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-buttons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth-buttons.component.html',
  styleUrl: './auth-buttons.component.scss',
})
export class AuthButtonsComponent {
  @Input() isLogin: boolean = true;

  constructor(private router: Router) {}

  showLogin() {
    this.router.navigate(['/login']);
  }

  showRegister() {
    this.router.navigate(['/register']);
  }
}