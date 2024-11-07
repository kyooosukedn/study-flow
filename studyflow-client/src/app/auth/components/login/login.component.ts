import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  
  loginForm: FormGroup | undefined;
  isLoading = false;
  error : string | null = null;


  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }
  ngOnInit(): void {
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  // getter methods
  get email() {
    return this.loginForm?.get('email');
  }

  get password() {
    return this.loginForm?.get('password');
  }

  onSubmit() :void {
    // if form is invalid, show validation errors
    if (this.loginForm?.invalid) {
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm?.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      })
      return;
    }
    
    this.isLoading = true;
    this.error = null;

    const { email, password } = this.loginForm?.value;

    this.authService.login(email, password).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.error = error;
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    })
  }
}
