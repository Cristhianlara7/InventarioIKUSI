import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/usuarios`;
  private userSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
    const user = localStorage.getItem('user');
    if (user) {
      this.userSubject.next(JSON.parse(user));
    }
  }

  getToken(): string | null {
    const user = this.userSubject.value;
    return user ? user.token : null;
  }

  register(userData: { nombre: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData)
      .pipe(
        tap((response: any) => {
          localStorage.setItem('user', JSON.stringify(response));
          this.userSubject.next(response);
        })
      );
  }
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response: any) => {
          localStorage.setItem('user', JSON.stringify(response));
          this.userSubject.next(response);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  getUser(): Observable<any> {
    return this.userSubject.asObservable();
  }

  isAuthenticated(): boolean {
    return this.userSubject.value !== null;
  }

  cambiarPassword(passwordData: {
    passwordActual: string,
    nuevaPassword: string,
    confirmarPassword: string
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/cambiar-password`, passwordData)
      .pipe(
        tap(() => {
          // Opcional: Actualizar el token si el backend lo devuelve
          this.logout();
        })
      );
  }
}