import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { RegisterRequestInterface } from '../../types/registerRequest.interface';
import { SocketService } from '../../../shared/services/socket.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'auth-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  errorMessage: string | null = null;

  form = new FormGroup({
    'email': new FormControl('', [Validators.required]),
    'username': new FormControl('', [Validators.required]),
    'password': new FormControl('', [Validators.required])
  });

  constructor(
    private socketService: SocketService,
    private authService: AuthService,
    private router: Router
  ) { }

  onSubmit(): void {
    this.authService.register(this.form.value as RegisterRequestInterface).subscribe({
      next: (currentUser) => {
        console.log('currentUSer', currentUser);
        this.authService.setToken(currentUser);
        this.socketService.setupSocketConnection(currentUser);
        this.authService.setCurrentUser(currentUser);
        this.errorMessage = null;
        this.router.navigateByUrl('/');
      },
      error: (err: HttpErrorResponse) => {
        console.log('err', err.error);
        this.errorMessage = err.error.join(', ');
      }
    });
  }
}
