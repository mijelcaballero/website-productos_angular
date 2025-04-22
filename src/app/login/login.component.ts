import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  email: string = '';  // 
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        const reservaPendiente = localStorage.getItem('reservaPendiente');
  
        if (reservaPendiente) {
          const { peliculaId, titulo } = JSON.parse(reservaPendiente);
          localStorage.removeItem('reservaPendiente'); // Limpia el storage
  
          this.router.navigate(['/reserva', peliculaId], {
            state: { titulo }
          });
        } else {
          this.router.navigate(['/home']); // o la ruta por defecto
        }
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
