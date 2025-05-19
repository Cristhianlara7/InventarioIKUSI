import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EquipoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  asignarEquipo(equipoId: string, empleadoId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/equipos/${equipoId}/asignar-equipo`, {
      empleadoId
    });
  }

  getEquiposAsignados(usuarioId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/equipos/usuario/${usuarioId}/asignados`).pipe(
      tap(response => console.log('Respuesta del servidor para equipos asignados:', response))
    );
  }

  devolverEquipo(equipoId: string, motivo: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/equipos/${equipoId}/devolver`, { motivo });
  }

  // Método para obtener estadísticas generales
  getEstadisticas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/equipos/estadisticas`);
  }

  // Método para generar reporte de equipos por tipo
  getReportePorTipo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/equipos/reporte/tipo`);
  }

  // Método para generar reporte de equipos por estado
  getReportePorEstado(): Observable<any> {
    return this.http.get(`${this.apiUrl}/equipos/reporte/estado`);
  }

  // Método para generar reporte de asignaciones
  getReporteAsignaciones(fechaInicio?: string, fechaFin?: string): Observable<any> {
    let url = `${this.apiUrl}/equipos/reporte/asignaciones`;
    if (fechaInicio && fechaFin) {
      url += `?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
    }
    return this.http.get(url);
  }

  // Método para exportar a Excel
  exportarExcel(tipoReporte: string, filtros?: any): Observable<Blob> {
    let url = `${this.apiUrl}/equipos/exportar/${tipoReporte}`;
    return this.http.post(url, filtros, {
      responseType: 'blob'
    });
  }

  // Método para exportar a PDF
  exportarPDF(tipoReporte: string, filtros?: any): Observable<Blob> {
    let url = `${this.apiUrl}/equipos/exportar/${tipoReporte}/pdf`;
    return this.http.post(url, filtros, {
      responseType: 'blob'
    });
  }
}