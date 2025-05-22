import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TipoEquipoService {
  private apiUrl = `${environment.apiUrl}/tipos-equipo`;

  constructor(private http: HttpClient) {}

  getTiposEquipo(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  crearTipoEquipo(tipoEquipo: {
    nombre: string;
    descripcion: string;
  }): Observable<any> {
    return this.http.post(this.apiUrl, tipoEquipo);
  }

  actualizarTipoEquipo(id: string, tipoEquipo: {
    nombre: string;
    descripcion: string;
  }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, tipoEquipo);
  }

  eliminarTipoEquipo(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}