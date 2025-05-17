import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';  // Agregar esta importación
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
    console.log('Solicitando equipos asignados para usuario:', usuarioId);
    // Change the endpoint structure to match the backend
    return this.http.get(`${this.apiUrl}/usuario/${usuarioId}/asignados`).pipe(
        tap(response => console.log('Respuesta del servidor para equipos asignados:', response))
    );
  }

  devolverEquipo(equipoId: string, motivo: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${equipoId}/devolver`, { motivo });
  }
}