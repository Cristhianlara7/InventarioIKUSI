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
    console.log('URL de asignación:', `${this.apiUrl}/${equipoId}/asignar-equipo`);
    console.log('Datos a enviar:', { equipoId, usuarioId });
    return this.http.post(`${this.apiUrl}/${equipoId}/asignar-equipo`, { usuarioId });
  }

  getEquiposAsignados(usuarioId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/asignados/${usuarioId}`);
  }

  devolverEquipo(equipoId: string, motivo: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${equipoId}/devolver`, { motivo });
  }
}