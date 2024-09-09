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
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  login(): void {
    this.authService.authenticate(this.username, this.password).subscribe(isAuthenticated => {
      if (isAuthenticated) {
        // Redirige al usuario a la página principal
        this.router.navigate(['/']);
      } else {
        this.errorMessage = 'Nombre de usuario o contraseña incorrectos';
      }
    });
  }
}
