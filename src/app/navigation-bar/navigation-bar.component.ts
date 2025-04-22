import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { User } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-navigation-bar',
  imports: [CommonModule, RouterModule, NgIf, AsyncPipe],
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent {
  user$: Observable<User | null>;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.user$ = this.authService.user$; // ✅ 
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
