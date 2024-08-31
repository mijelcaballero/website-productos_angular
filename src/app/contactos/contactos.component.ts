import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contactos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule], // Importar ReactiveFormsModule aquí
  templateUrl: './contactos.component.html',
  styleUrls: ['./contactos.component.css']
})
export class ContactosComponent {
  subscriptionForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.subscriptionForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit(): void {
    if (this.subscriptionForm.valid) {
      console.log('Form Submitted:', this.subscriptionForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
