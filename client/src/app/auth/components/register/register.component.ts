import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component } from '@angular/core';

import { RegisterRequestInterface } from '../../types/registerRequest.interface';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'auth-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  error: string | null = null;

  constructor(private authService: AuthService) { }

  form = new FormGroup({
    'email': new FormControl('', [Validators.required]),
    'username': new FormControl('', [Validators.required]),
    'password': new FormControl('', [Validators.required])
  })

  onSubmit(): void {
    this.authService.register(this.form.value as RegisterRequestInterface).subscribe({
      next: (currentUser) => {
        this.authService.setToken(currentUser);
        this.authService.setCurrentUser(currentUser);
      },
      error: (err: HttpErrorResponse) => {
        console.log('err', err.error);
        this.error = err.error.join(', ');
      }
    });
  }
}
