import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid p-4">
      <div class="row mb-4">
        <div class="col">
          <div class="d-flex justify-content-between align-items-center">
            <h2>Historial de Movimientos del Equipo</h2>
            <button class="btn btn-primary" (click)="volver()">
              <i class="fas fa-arrow-left"></i> Volver
            </button>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <div class="card">
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-striped table-hover">
                  <thead class="table-dark">
                    <tr>
                      <th>Fecha</th>
                      <th>Tipo de Movimiento</th>
                      <th>Descripción</th>
                      <th>Empleado Anterior</th>
                      <th>Empleado Nuevo</th>
                      <th>Realizado Por</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let registro of historial">
                      <td>{{registro.fechaMovimiento | date:'dd/MM/yyyy HH:mm'}}</td>
                      <td>
                        <span [ngClass]="{
                          'badge bg-success': registro.tipoMovimiento === 'asignacion',
                          'badge bg-warning': registro.tipoMovimiento === 'devolucion',
                          'badge bg-info': registro.tipoMovimiento === 'mantenimiento',
                          'badge bg-primary': registro.tipoMovimiento === 'actualizacion'
                        }">
                          {{registro.tipoMovimiento | titlecase}}
                        </span>
                      </td>
                      <td>{{registro.descripcion}}</td>
                      <td>{{registro.empleadoAnterior?.nombres}} {{registro.empleadoAnterior?.apellidos}}</td>
                      <td>{{registro.empleadoNuevo?.nombres}} {{registro.empleadoNuevo?.apellidos}}</td>
                      <td>{{registro.realizadoPor?.nombres}} {{registro.realizadoPor?.apellidos}}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container-fluid {
      max-width: 1400px;
      margin: 0 auto;
    }
    .table-responsive {
      overflow-x: auto;
    }
    .badge {
      padding: 8px 12px;
      font-size: 0.9em;
    }
    .table th, .table td {
      vertical-align: middle;
    }
    .table-hover tbody tr:hover {
      background-color: rgba(0,0,0,.075);
    }
  `]
})
export class HistorialComponent implements OnInit {
  historial: any[] = [];
  equipoId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.equipoId = this.route.snapshot.params['id'];
    this.cargarHistorial();
  }

  cargarHistorial() {
    this.http.get(`${environment.apiUrl}/historial/equipo/${this.equipoId}`)
      .subscribe({
        next: (data: any) => {
          this.historial = data;
        },
        error: (error) => {
          console.error('Error al cargar historial:', error);
          alert('Error al cargar el historial');
        }
      });
  }

  volver() {
    this.router.navigate(['/equipos']);
  }
}