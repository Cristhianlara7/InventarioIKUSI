import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EquipoService {
  private apiUrl = `${environment.apiUrl}/equipos`;

  constructor(private http: HttpClient) {}

  asignarEquipo(equipoId: string, usuarioId: string): Observable<any> {
    const payload = {
      usuarioId: usuarioId,
      estado: 'Asignado'
    };
    // Probamos con una ruta más simple
    return this.http.post(`${this.apiUrl}/${equipoId}/asignar-usuario`, payload);
  }

  getEquiposAsignados(usuarioId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  getEquiposDisponibles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/disponibles`);
  }

  devolverEquipo(equipoId: string, motivo: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${equipoId}/devolver`, { motivo });
  }

  actualizarEstadoEquipo(equipoId: string, estado: string, notas: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${equipoId}/estado`, { estado, notas });
  }
}