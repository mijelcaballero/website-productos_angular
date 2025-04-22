import { Injectable } from '@angular/core';
import { Auth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { BehaviorSubject, from, Observable, firstValueFrom} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor(private auth: Auth) {
    onAuthStateChanged(this.auth, user => {
      this.currentUserSubject.next(user);
    });
  }

  register(email: string, password: string) {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  login(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  logout() {
    return from(signOut(this.auth));
  }

  get user$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  async getCurrentUser(): Promise<User | null> {
    return await firstValueFrom(this.user$);
  }
  
}
