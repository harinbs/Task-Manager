import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errorMessage: string | null = null;
  isLogin = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.registerForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
    }, { validators: this.passwordsMatchValidator });
  }

  ngOnInit() {
    this.route.url.subscribe(url => {
      this.isLogin = this.router.url === '/login';
    });
  }

  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  showLogin() {
    this.router.navigate(['/login']);
  }

  showRegister() {
    this.router.navigate(['/register']);
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.onRegister(this.registerForm.value).subscribe({
        next: () => {
          // Redirect to login page after successful registration
          this.router.navigate(['/login']);
        },
        error: (err: any) => {
          // Handle registration error
          if (err.error && err.error.msg) {
            if (err.error.msg === 'Email already exists') {
              this.errorMessage = 'Email already exists';
            } else if (err.error.msg === 'Username already exists') {
              this.errorMessage = 'Username already exists';
            } else {
              this.errorMessage = err.error.msg;
            }
          } else {
            this.errorMessage = 'An error occurred during registration.';
          }
          console.error('Registration error:', err);
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}