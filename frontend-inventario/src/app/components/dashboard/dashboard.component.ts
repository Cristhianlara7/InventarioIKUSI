import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <h2>Dashboard de Inventario</h2>
      
      <div class="stats-container">
        <div class="stat-card">
          <h3>Total Equipos</h3>
          <p>{{estadisticas.totalEquipos}}</p>
        </div>
        <div class="stat-card">
          <h3>Equipos Asignados</h3>
          <p>{{estadisticas.equiposAsignados}}</p>
        </div>
        <div class="stat-card">
          <h3>Equipos Disponibles</h3>
          <p>{{estadisticas.equiposDisponibles}}</p>
        </div>
      </div>

      <div class="alerts-container">
        <h3>Alertas Pendientes</h3>
        <div *ngFor="let alerta of alertas" class="alert-card">
          <p>{{alerta.mensaje}}</p>
          <small>Vence: {{alerta.fechaVencimiento | date}}</small>
        </div>
      </div>

      <div class="distribution-container">
        <div class="chart-container">
          <h3>Distribución por Tipo</h3>
          <!-- Aquí irá el gráfico de tipos -->
        </div>
        <div class="chart-container">
          <h3>Distribución por Marca</h3>
          <!-- Aquí irá el gráfico de marcas -->
        </div>
      </div>
      <div class="charts-row">
        <div class="chart-container">
          <canvas id="tiposChart"></canvas>
        </div>
        <div class="chart-container">
          <canvas id="marcasChart"></canvas>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
    }
    .stats-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .stat-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .alerts-container {
      margin-bottom: 30px;
    }
    .alert-card {
      background: #fff3cd;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 10px;
    }
    .distribution-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }
    .chart-container {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .charts-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-top: 20px;
    }
    .chart-container {
      background: white;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  `]
})
export class DashboardComponent implements OnInit, AfterViewInit {
  estadisticas: any = {
    totalEquipos: 0,
    equiposAsignados: 0,
    equiposDisponibles: 0
  };
  alertas: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarEstadisticas();
    this.cargarAlertas();
  }

  cargarEstadisticas() {
    this.http.get(`${environment.apiUrl}/equipos/estadisticas`)
      .subscribe((data: any) => {
        this.estadisticas = data;
      });
  }

  cargarAlertas() {
    this.http.get(`${environment.apiUrl}/alertas/pendientes`)
      .subscribe((data: any) => {
        this.alertas = data;
      });
  }

  ngAfterViewInit() {
    this.cargarGraficos();
  }

  cargarGraficos() {
    this.http.get(`${environment.apiUrl}/equipos/estadisticas`).subscribe((data: any) => {
      this.crearGraficoTipos(data.equiposPorTipo);
      this.crearGraficoMarcas(data.equiposPorMarca);
    });
  }

  crearGraficoTipos(datos: any[]) {
    const ctx = document.getElementById('tiposChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: datos.map(item => item.tipoEquipo[0].nombre),
        datasets: [{
          data: datos.map(item => item.cantidad),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Distribución por Tipo de Equipo'
          }
        }
      }
    });
  }

  crearGraficoMarcas(datos: any[]) {
    const ctx = document.getElementById('marcasChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: datos.map(item => item._id),
        datasets: [{
          label: 'Cantidad de Equipos',
          data: datos.map(item => item.cantidad),
          backgroundColor: '#36A2EB'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Distribución por Marca'
          }
        }
      }
    });
  }
}