import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EquipoService } from '../../services/equipo.service';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';  // Agregar Router aquí

@Component({
  selector: 'app-asignar-equipo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="asignar-container">
      <h2>Asignar Equipo</h2>
      
      <div class="empleados-list">
        <h3>Empleados Disponibles</h3>
        <div class="empleado-grid">
          <div *ngFor="let empleado of empleados" class="empleado-card">
            <h4>{{ empleado.nombres }} {{ empleado.apellidos }}</h4>
            <p>Email: {{ empleado.email }}</p>
            <p>Departamento: {{ empleado.departamento }}</p>
            <button (click)="asignarEquipo(empleado._id)" class="btn-asignar">
              Seleccionar Empleado
            </button>
          </div>
        </div>
      </div>

      <div class="equipos-asignados">
        <h3>Equipos Asignados</h3>
        <div class="equipo-list">
          <div *ngFor="let equipo of equiposAsignados" class="equipo-card">
            <h4>{{ equipo.nombre }}</h4>
            <p>Modelo: {{ equipo.modelo }}</p>
            <p>Serial: {{ equipo.serial }}</p>
            <p class="estado">Estado: {{ equipo.estado }}</p>
            <button (click)="devolverEquipo(equipo._id)" class="btn-devolver">
              Devolver Equipo
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .asignar-container {
      padding: 2rem;
    }

    .equipo-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    .equipo-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .equipo-card h4 {
      margin: 0 0 1rem 0;
      color: #2c3e50;
    }

    .btn-asignar {
      background: #2a5298;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      width: 100%;
      margin-top: 1rem;
    }

    .btn-asignar:hover {
      background: #1e3c72;
    }

    .estado {
      color: #2a5298;
      font-weight: bold;
    }

    h2, h3 {
      color: #2c3e50;
      margin-bottom: 1.5rem;
    }

    .equipos-asignados {
      margin-top: 2rem;
    }
    .empleado-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }
    .empleado-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .btn-devolver {
      background: #e74c3c;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      width: 100%;
      margin-top: 1rem;
    }
    .btn-devolver:hover {
      background: #c0392b;
    }
  `]
})
export class AsignarEquipoComponent implements OnInit {
  equiposDisponibles: any[] = [];
  equiposAsignados: any[] = [];
  empleados: any[] = [];  // Cambiado de usuarios a empleados
  usuarioId: string = '';
  equipoId: string = '';

  constructor(
    private equipoService: EquipoService,
    private authService: AuthService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.equipoId = params['equipoId'];
      if (!this.equipoId) {
        console.error('No se proporcionó ID del equipo');
        alert('Error: No se proporcionó ID del equipo');
        this.router.navigate(['/equipos']);
        return;
      }
    });
    this.cargarEmpleados();
  }

  asignarEquipo(empleadoId: string) {
    if (!this.equipoId || !empleadoId) {
        alert('Error: Se requieren tanto el ID del equipo como el ID del empleado');
        return;
    }

    this.http.post(`${environment.apiUrl}/equipos/${this.equipoId}/asignar-equipo`, {
        empleadoId: empleadoId
    }).subscribe({
        next: (response: any) => {
            console.log('Equipo asignado:', response);
            if (response && response.message) {
                alert(response.message);
            } else {
                alert('Equipo asignado exitosamente');
            }
            // Redirigir después de una asignación exitosa
            this.router.navigate(['/equipos']).then(() => {
                // Recargar la página para asegurar que se muestren los datos actualizados
                window.location.reload();
            });
        },
        error: (error) => {
            console.error('Error al asignar equipo:', error);
            let mensajeError = 'Error al asignar el equipo: ';
            
            if (error.error?.message) {
                mensajeError += error.error.message;
            } else {
                mensajeError += 'No se pudo completar la asignación';
            }
            
            alert(mensajeError);
        }
    });
}

  cargarEmpleados() {  // Nuevo método para cargar empleados
    this.http.get(`${environment.apiUrl}/empleados`).subscribe((data: any) => {
      this.empleados = data;
    });
  }

  cargarEquiposAsignados(usuarioId: string) {
    if (usuarioId) {
      this.equipoService.getEquiposAsignados(usuarioId).subscribe(equipos => {
        this.equiposAsignados = equipos;
      });
    }
  }

  devolverEquipo(equipoId: string) {
    const motivo = prompt('Por favor, ingrese el motivo de la devolución (formateo, cambio de batería, etc.):');
    if (motivo) {
      this.http.post(`${environment.apiUrl}/equipos/${equipoId}/devolver`, { motivo }).subscribe({
        next: () => {
          alert('Equipo devuelto exitosamente');
          // Pasamos el usuarioId actual al método
          this.cargarEquiposAsignados(this.usuarioId);
        },
        error: (error) => {
          console.error('Error al devolver equipo:', error);
          alert('Error al devolver el equipo');
        }
      });
    }
  }
}