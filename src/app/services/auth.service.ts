import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'assets/products.json'; // Ruta al archivo JSON
  private authenticated = new BehaviorSubject<boolean>(false); // Estado de autenticación

  constructor(private http: HttpClient) {}

  // Método para autenticar al usuario
  authenticate(username: string, password: string): Observable<boolean> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => {
        const user = data.users.find((u: { username: string; password: string; }) => u.username === username && u.password === password);
        const isAuthenticated = !!user; // Devuelve true si el usuario existe
        this.authenticated.next(isAuthenticated); // Actualiza el estado de autenticación
        return isAuthenticated;
      }),
      catchError(() => {
        this.authenticated.next(false);
        return of(false); // Devuelve false en caso de error
      })
    );
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): Observable<boolean> {
    return this.authenticated.asObservable();
  }

  // Método para cerrar sesión
  logout(): void {
    this.authenticated.next(false); // Actualiza el estado de autenticación a no autenticado
  }
}
