import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email = '';
  password = '';
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.authService.register(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/']); // Redirige a Home
      },
      error: err => {
        this.error = 'Error al registrarse.';
        console.error(err);
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
