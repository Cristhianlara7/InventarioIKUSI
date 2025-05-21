import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { LoginResponse } from '../interfaces/auth.interface';

interface Usuario {
  _id: string;
  nombre: string;
  email: string;
  rol: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  getUser(): Observable<Usuario> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No hay token disponible'));
    }
    
    return this.http.get<Usuario>(`${environment.apiUrl}/usuarios/perfil`, this.getHeaders()).pipe(
      tap(user => {
        localStorage.setItem('user', JSON.stringify(user));
      }),
      catchError(error => {
        if (error.status === 401) {
          this.logout();
        }
        return throwError(() => error);
      })
    );
  }

  login(credentials: { email: string; password: string }) {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/usuarios/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          if (response.user) {
            localStorage.setItem('user', JSON.stringify(response.user));
          }
        }
      }),
      catchError(error => {
        console.error('Error en login:', error);
        return throwError(() => error);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  cambiarPassword(data: { passwordActual: string; nuevaPassword: string }): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No hay token disponible'));
    }

    return this.http.post(
      `${environment.apiUrl}/usuarios/cambiar-password`,
      data,
      this.getHeaders()
    ).pipe(
      tap(response => {
        console.log('Contraseña actualizada correctamente');
      }),
      catchError(error => {
        console.error('Error al cambiar contraseña:', error);
        if (error.status === 401) {
          if (error.error?.message?.includes('token')) {
            this.logout();
          }
        }
        return throwError(() => error);
      })
    );
  }

  register(userData: { nombre: string; email: string; password: string }) {
    return this.http.post<any>(`${environment.apiUrl}/usuarios/register`, userData);
  }
}

