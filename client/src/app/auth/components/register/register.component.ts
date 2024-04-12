import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'auth-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  form = new FormGroup({
    'email': new FormControl('', [Validators.required]),
    'username': new FormControl('', [Validators.required]),
    'password': new FormControl('', [Validators.required])
  })

  onSubmit(): void {
    console.log('onSubmit', this.form.value)
  }
}
