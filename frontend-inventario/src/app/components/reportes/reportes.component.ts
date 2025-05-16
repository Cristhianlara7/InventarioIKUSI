import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="reportes-container">
      <h2>Reportes del Sistema</h2>
      
      <div class="reportes-grid">
        <div class="reporte-card">
          <h3>Inventario General</h3>
          <p>Descarga el reporte completo del inventario en formato Excel</p>
          <button (click)="descargarReporteInventario()">Descargar Excel</button>
        </div>

        <div class="reporte-card">
          <h3>Mantenimientos</h3>
          <p>Reporte de mantenimientos realizados en formato PDF</p>
          <button (click)="descargarReporteMantenimientos()">Descargar PDF</button>
        </div>

        <div class="reporte-card">
          <h3>Equipos por Usuario</h3>
          <p>Listado de equipos asignados a cada usuario</p>
          <button (click)="descargarReporteEquiposUsuario()">Descargar Excel</button>
        </div>

        <div class="reporte-card">
          <h3>Historial de Movimientos</h3>
          <p>Registro histórico de asignaciones y devoluciones</p>
          <button (click)="descargarHistorialMovimientos()">Descargar Excel</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reportes-container {
      padding: 20px;
    }
    .reportes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    .reporte-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .reporte-card h3 {
      margin-top: 0;
      color: #2c3e50;
    }
    .reporte-card button {
      background: #2c3e50;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 10px;
    }
    .reporte-card button:hover {
      background: #34495e;
    }
  `]
})
export class ReportesComponent {
  constructor(private http: HttpClient) {}

  descargarReporteInventario() {
    window.open(`${environment.apiUrl}/reportes/excel/inventario`, '_blank');
  }

  descargarReporteMantenimientos() {
    window.open(`${environment.apiUrl}/reportes/pdf/mantenimientos`, '_blank');
  }

  descargarReporteEquiposUsuario() {
    window.open(`${environment.apiUrl}/reportes/excel/equipos-usuario`, '_blank');
  }

  descargarHistorialMovimientos() {
    window.open(`${environment.apiUrl}/reportes/excel/historial`, '_blank');
  }
}