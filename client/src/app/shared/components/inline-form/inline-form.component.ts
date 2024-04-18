import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'inline-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './inline-form.component.html',
  styleUrl: './inline-form.component.scss'
})
export class InlineFormComponent {
  @Input() defaultText: string = 'Not defined';
  @Input() buttonText: string = 'Submit';
  @Input() inputPlaceholder: string = '';
  @Input() inputType: string = 'input';
  @Input() hasButton: boolean = false;
  @Input() title: string = '';

  @Output() handleSubmit = new EventEmitter<string>();

  isEditing: boolean = false;
  form = new FormGroup({
    title: new FormControl(''),
  });

  activateEditing(): void {
    if (this.title) {
      this.form.patchValue({ title: this.title });
    }
    this.isEditing = true;
  }

  onSubmit(): void {
    if (this.form.value.title) {
      this.handleSubmit.emit(this.form.value.title);
    }
    this.isEditing = false;
    this.form.reset();
  }
}
