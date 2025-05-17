import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private userSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
    // Inicializar userSubject con el usuario del localStorage si existe
    const user = localStorage.getItem('user');
    if (user) {
      this.userSubject.next(JSON.parse(user));
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  register(userData: { nombre: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData)
      .pipe(
        tap((response: any) => {
          if (response.token) {
            localStorage.setItem('token', response.token);
          }
          if (response.user) {
            localStorage.setItem('user', JSON.stringify(response.user));
            this.userSubject.next(response.user);
          }
        })
      );
  }

  login(credentials: {email: string, password: string}) {
    return this.http.post<any>(`${environment.apiUrl}/usuarios/login`, credentials)
      .pipe(
        tap(response => {
          if (response && response.token) {
            // Guardamos tanto el token como el usuario
            localStorage.setItem('token', response.token);
            if (response.usuario) {
              localStorage.setItem('user', JSON.stringify(response.usuario));
              this.userSubject.next(response.usuario);
            }
          }
        })
      );
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  getUser(): Observable<any> {
    return this.userSubject.asObservable();
  }


  cambiarPassword(passwordData: {
    passwordActual: string,
    nuevaPassword: string,
    confirmarPassword: string
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/cambiar-password`, passwordData)
      .pipe(
        tap(() => {
          this.logout();
        })
      );
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios`);
  }
}

