import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EquipoService } from '../../services/equipo.service';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-asignar-equipo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="asignar-container">
      <h2>Asignar Equipo</h2>
      
      <div class="usuarios-list">
        <h3>Usuarios Disponibles</h3>
        <div class="usuario-grid">
          <div *ngFor="let usuario of usuarios" class="usuario-card">
            <h4>{{ usuario.nombre }}</h4>
            <p>Email: {{ usuario.email }}</p>
            <button (click)="asignarEquipo(usuario._id)" class="btn-asignar">
              Seleccionar Usuario
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
    .usuario-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }
    .usuario-card {
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
  usuarios: any[] = [];
  usuarioId: string = '';
  equipoId: string = '';

  constructor(
    private equipoService: EquipoService,
    private authService: AuthService,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.equipoId = params['equipoId'];
    });
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.http.get(`${environment.apiUrl}/usuarios`).subscribe((data: any) => {
      this.usuarios = data;
    });
  }

  cargarEquiposAsignados(usuarioId: string) {
    if (usuarioId) {
      this.equipoService.getEquiposAsignados(usuarioId).subscribe(equipos => {
        this.equiposAsignados = equipos;
      });
    }
  }

  asignarEquipo(usuarioId: string) {
    if (!this.equipoId) {
      alert('No se ha seleccionado ningún equipo para asignar');
      return;
    }

    if (!usuarioId) {
      alert('No se ha seleccionado un usuario válido');
      return;
    }

    console.log('Datos de asignación:', {
      equipoId: this.equipoId,
      usuarioId: usuarioId
    });

    this.equipoService.asignarEquipo(this.equipoId, usuarioId).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        alert('Equipo asignado exitosamente');
        this.cargarEquiposAsignados(usuarioId);
      },
      error: (error) => {
        console.error('Error completo:', error);
        let mensajeError = 'Error al asignar el equipo. ';
        
        if (error.status === 404) {
          mensajeError += 'La ruta de asignación no existe en el servidor.';
        } else if (error.error && error.error.message) {
          mensajeError += error.error.message;
        } else {
          mensajeError += 'Verifique la conexión con el servidor.';
        }
        
        alert(mensajeError);
      }
    });
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