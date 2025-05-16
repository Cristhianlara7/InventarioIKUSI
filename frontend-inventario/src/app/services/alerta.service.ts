import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlertaService {
  private apiUrl = `${environment.apiUrl}/alertas`;

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error en la operación';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error del servidor: ${error.status}, mensaje: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  getAlertasPendientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pendientes`)
      .pipe(catchError(this.handleError));
  }

  marcarComoCompletada(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/completar`, {})
      .pipe(catchError(this.handleError));
  }

  crearAlertaMantenimiento(equipoId: string, fechaVencimiento: Date): Observable<any> {
    return this.http.post(this.apiUrl, {
      equipo: equipoId,
      tipo: 'mantenimiento',
      mensaje: 'Mantenimiento programado',
      fechaVencimiento
    }).pipe(catchError(this.handleError));
  }
}