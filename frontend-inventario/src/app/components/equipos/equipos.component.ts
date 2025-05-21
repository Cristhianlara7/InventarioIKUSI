import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-equipos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="equipos-container">
      <div class="search-container" *ngIf="!formularioVisible">
        <input 
          type="text" 
          placeholder="Buscar por código o serial..." 
          [(ngModel)]="searchTerm"
          (input)="filtrarEquipos()">
        <button class="btn-primary" (click)="agregarEquipo()">Nuevo Equipo</button>
      </div>

      <!-- Lista de Equipos -->
      <div class="equipos-list" *ngIf="!formularioVisible">
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Tipo</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Serial</th>
              <th>Empleado Asignado</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let equipo of equiposFiltrados">
              <td>{{equipo.codigo}}</td>
              <td>{{equipo.tipoEquipo?.nombre}}</td>
              <td>{{equipo.marca}}</td>
              <td>{{equipo.modelo}}</td>
              <td>{{equipo.serial}}</td>
              <td>
                <span *ngIf="equipo.empleadoAsignado">
                  {{equipo.empleadoAsignado.nombres}} {{equipo.empleadoAsignado.apellidos}}
                </span>
                <span *ngIf="!equipo.empleadoAsignado" class="no-asignado">
                  No asignado
                </span>
              </td>
              <td>
                <span [class]="'estado-' + determinarEstado(equipo).toLowerCase()">
                  {{determinarEstado(equipo)}}
                </span>
              </td>
              <td class="acciones">
                <button class="btn-detalles" (click)="mostrarDetalles(equipo)">
                  <i class="fas fa-info-circle"></i> Ver Detalles
                </button>
                <button class="btn-actualizar" (click)="editarEquipo(equipo)">
                  <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-asignar" *ngIf="!equipo.empleadoAsignado" (click)="asignarEquipo(equipo._id)">
                  <i class="fas fa-user-plus"></i> Asignar
                </button>
                <button class="btn-desasignar" *ngIf="equipo.empleadoAsignado" (click)="desasignarEquipo(equipo._id)">
                  <i class="fas fa-user-minus"></i> Desasignar
                </button>
                <button class="btn-eliminar" (click)="eliminarEquipo(equipo._id)">
                  <i class="fas fa-trash"></i> Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Formulario de Equipo -->
      <div class="form-container" *ngIf="formularioVisible">
        <form [formGroup]="equipoForm" (ngSubmit)="guardarEquipo()">
          <div class="form-group">
            <label>Código</label>
            <input type="text" formControlName="codigo">
          </div>
          <div class="form-group">
            <label>Tipo de Equipo</label>
            <select formControlName="tipoEquipo" (change)="onTipoEquipoChange()">
              <option *ngFor="let tipo of tiposEquipo" [value]="tipo._id">
                {{tipo.nombre}}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Marca</label>
            <input type="text" formControlName="marca">
          </div>
          <div class="form-group">
            <label>Modelo</label>
            <input type="text" formControlName="modelo">
          </div>
          <div class="form-group">
            <label>Serial</label>
            <input type="text" formControlName="serial">
          </div>

          <!-- Campos adicionales para computadores -->
          <ng-container *ngIf="esComputador()">
            <div class="form-group">
              <label>Memoria RAM:</label>
              <input type="text" formControlName="memoriaRam">
            </div>

            <div class="form-group">
              <label>Disco Duro:</label>
              <input type="text" formControlName="discoDuro">
            </div>

            <div class="form-group">
              <label>Procesador:</label>
              <input type="text" formControlName="procesador">
            </div>
          </ng-container>

          <div class="form-buttons">
            <button type="submit" class="btn-primary">Guardar</button>
            <button type="button" class="btn-secondary" (click)="cancelar()">Cancelar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de Detalles -->
      <div class="modal" *ngIf="modalVisible">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Detalles del Equipo</h2>
            <button class="btn-cerrar" (click)="cerrarModal()">×</button>
          </div>
          <div class="modal-body">
            <div class="detalle-item">
              <strong>Código:</strong> {{equipoSeleccionadoDetalles?.codigo}}
            </div>
            <div class="detalle-item">
              <strong>Tipo:</strong> {{equipoSeleccionadoDetalles?.tipoEquipo?.nombre}}
            </div>
            <div class="detalle-item">
              <strong>Marca:</strong> {{equipoSeleccionadoDetalles?.marca}}
            </div>
            <div class="detalle-item">
              <strong>Modelo:</strong> {{equipoSeleccionadoDetalles?.modelo}}
            </div>
            <div class="detalle-item">
              <strong>Serial:</strong> {{equipoSeleccionadoDetalles?.serial}}
            </div>
            <div class="detalle-item">
              <strong>Estado:</strong> {{determinarEstado(equipoSeleccionadoDetalles)}}
            </div>
            <div class="detalle-item" *ngIf="equipoSeleccionadoDetalles?.empleadoAsignado">
              <strong>Empleado Asignado:</strong> 
              {{equipoSeleccionadoDetalles?.empleadoAsignado?.nombres}} 
              {{equipoSeleccionadoDetalles?.empleadoAsignado?.apellidos}}
            </div>
            
            <!-- Campos específicos para computadores -->
            <ng-container *ngIf="esComputadorDetalles(equipoSeleccionadoDetalles)">
              <div class="detalle-item">
                <strong>Memoria RAM:</strong> {{equipoSeleccionadoDetalles?.memoriaRam}}
              </div>
              <div class="detalle-item">
                <strong>Disco Duro:</strong> {{equipoSeleccionadoDetalles?.discoDuro}}
              </div>
              <div class="detalle-item">
                <strong>Procesador:</strong> {{equipoSeleccionadoDetalles?.procesador}}
              </div>
            </ng-container>
          </div>
        </div>
      </div>
  `,
  styles: [`
    .equipos-container {
      padding: 20px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
     .form-container {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 20px;
    }
    .form-group {
      margin-bottom: 15px;
    }
    .form-group label {
      display: block;
      margin-bottom: 5px;
    }
    .form-group input, .form-group select {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background-color: #f8f9fa;
      font-weight: 600;
    }
    .acciones {
      display: flex;
      gap: 8px;
    }
    .btn-ver {
      background-color: #17a2b8;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-editar {
      background-color: #28a745;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-asignar {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-eliminar {
      background-color: #dc3545;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-primary {
      background-color: #007bff;
      color: white;
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-secondary {
      background-color: #6c757d;
      color: white;
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-left: 8px;
    }
    .search-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
  
    .search-container input {
      width: 300px;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
  
    .btn-actualizar {
      background-color: #17a2b8;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
    }
  
    .btn-detalles {
      background-color: #6c757d;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    
    .btn-detalles:hover {
      background-color: #5a6268;
    }
    .btn-desasignar {
      background-color: #ffc107;
      color: black;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
    }

    .form-container {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 20px;
    }
    .form-group {
      margin-bottom: 15px;
    }
    .form-group label {
      display: block;
      margin-bottom: 5px;
    }
    .form-group input, .form-group select {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background-color: #f8f9fa;
      font-weight: 600;
    }
    .acciones {
      display: flex;
      gap: 8px;
    }
    .btn-ver {
      background-color: #17a2b8;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-editar {
      background-color: #28a745;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-asignar {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-eliminar {
      background-color: #dc3545;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-primary {
      background-color: #007bff;
      color: white;
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-secondary {
      background-color: #6c757d;
      color: white;
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-left: 8px;
    }
    .search-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .search-container input {
      width: 300px;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .btn-actualizar {
      background-color: #17a2b8;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
    }

      .btn-detalles {
      background-color: #6c757d;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
    }
    .estado-asignado {
      color: #2ecc71;
      font-weight: bold;
    }
    
    .estado-disponible {
      color: #3498db;
      font-weight: bold;
    }
    
    .estado-enstock {
      color: #f1c40f;
      font-weight: bold;
    }
    
    .no-asignado {
      color: #95a5a6;
      font-style: italic;
    }
    
    td {
      vertical-align: middle;
      padding: 12px;
    }
    
    .acciones {
      display: flex;
      gap: 8px;
      justify-content: flex-start;
      align-items: center;
    }
    
    .acciones button {
      padding: 6px 12px;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    
    .acciones button i {
      font-size: 14px;
    }

    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background-color: white;
      padding: 20px;
      border-radius: 8px;
      width: 90%;
      max-width: 600px;
      max-height: 80vh;
      overflow-y: auto;
      position: relative;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }

    .modal-header h2 {
      margin: 0;
      color: #333;
      font-size: 1.5rem;
    }

    .btn-cerrar {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #666;
      padding: 5px;
      line-height: 1;
    }

    .btn-cerrar:hover {
      color: #333;
    }

    .modal-body {
      padding: 10px 0;
    }

    .detalle-item {
      margin-bottom: 15px;
      padding: 10px;
      border-bottom: 1px solid #eee;
      display: flex;
      align-items: center;
    }

    .detalle-item strong {
      min-width: 150px;
      color: #2a5298;
      font-weight: 600;
    }

    .detalle-item:last-child {
      border-bottom: none;
    }

    /* Estilos para diferentes estados */
    .estado-asignado {
      color: #2ecc71;
      font-weight: bold;
    }
    
    .estado-disponible {
      color: #3498db;
      font-weight: bold;
    }
    
    .estado-enstock {
      color: #f1c40f;
      font-weight: bold;
    }

  `]
})
export class EquiposComponent implements OnInit {
  equipoForm: FormGroup;
  equipos: any[] = [];
  tiposEquipo: any[] = [];
  formularioVisible = false;
  equipoSeleccionado: any = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.equipoForm = this.fb.group({
      codigo: ['', Validators.required],
      tipoEquipo: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      serial: ['', Validators.required],
      memoriaRam: [''],
      discoDuro: [''],
      procesador: ['']
    });
  }

  esComputador(): boolean {
    const tipoEquipoId = this.equipoForm.get('tipoEquipo')?.value;
    const tipoEquipo = this.tiposEquipo.find(tipo => tipo._id === tipoEquipoId);
    return tipoEquipo?.nombre.toLowerCase() === 'computador';
  }

  onTipoEquipoChange() {
    if (this.esComputador()) {
      // No hacemos nada especial, los campos ya están en el formulario
    } else {
      // Limpiamos los campos específicos de computador
      this.equipoForm.patchValue({
        memoriaRam: '',
        discoDuro: '',
        procesador: ''
      });
    }
  }

  ngOnInit() {
    this.cargarEquipos();
    this.cargarTiposEquipo();
  }

  searchTerm: string = '';
  equiposFiltrados: any[] = [];

  cargarEquipos() {
    this.http.get(`${environment.apiUrl}/equipos`).subscribe({
      next: (data: any) => {
        this.equipos = data;
        this.equiposFiltrados = this.equipos;
      },
      error: (error) => {
        console.error('Error al cargar equipos:', error);
        alert('Error al cargar los equipos');
      }
    });
  }

  filtrarEquipos() {
    if (!this.searchTerm) {
      this.equiposFiltrados = [...this.equipos];
      return;
    }
    
    const termino = this.searchTerm.toLowerCase();
    this.equiposFiltrados = this.equipos.filter(equipo => 
      equipo.codigo?.toLowerCase().includes(termino) ||
      equipo.serial?.toLowerCase().includes(termino)
    );
  }

  determinarEstado(equipo: any): string {
    if (equipo.empleadoAsignado) {
      return 'Asignado';
    } else if (equipo.enStock) {
      return 'En Stock';
    } else {
      return 'Disponible';
    }
  }

  cargarTiposEquipo() {
    this.http.get(`${environment.apiUrl}/tipos-equipo`).subscribe({
      next: (data: any) => {
        this.tiposEquipo = data;
      },
      error: (error) => {
        console.error('Error al cargar tipos de equipo:', error);
      }
    });
  }

  guardarEquipo() {
    if (this.equipoForm.valid) {
      const equipoData = this.equipoForm.value;
      
      if (this.equipoSeleccionado) {
        this.http.put(`${environment.apiUrl}/equipos/${this.equipoSeleccionado._id}`, equipoData)
          .subscribe({
            next: () => {
              alert('Equipo actualizado exitosamente');
              this.cargarEquipos();
              this.limpiarFormulario();
            },
            error: (error) => {
              console.error('Error al actualizar equipo:', error);
              alert('Error al actualizar el equipo');
            }
          });
      } else {
        this.http.post(`${environment.apiUrl}/equipos`, equipoData)
          .subscribe({
            next: () => {
              alert('Equipo creado exitosamente');
              this.cargarEquipos();
              this.limpiarFormulario();
            },
            error: (error) => {
              console.error('Error al crear equipo:', error);
              alert('Error al crear el equipo');
            }
          });
      }
    }
  }

  editarEquipo(equipo: any) {
    this.equipoSeleccionado = equipo;
    this.equipoForm.patchValue({
      nombre: equipo.nombre,
      modelo: equipo.modelo,
      serial: equipo.serial,
      tipoEquipo: equipo.tipoEquipo._id
    });
    this.formularioVisible = true;
  }

  asignarEquipo(equipoId: string) {
    this.router.navigate(['/equipos/asignar'], { 
      queryParams: { equipoId: equipoId }
    });
  }

  desasignarEquipo(id: string) {
    if (confirm('¿Está seguro de desasignar este equipo? El equipo quedará en estado "En Stock"')) {
      this.http.post(`${environment.apiUrl}/equipos/${id}/desasignar`, {}).subscribe({
        next: (response: any) => {
          alert('Equipo desasignado exitosamente');
          this.cargarEquipos();
        },
        error: (error) => {
          console.error('Error al desasignar equipo:', error);
          alert('Error al desasignar el equipo');
        }
      });
    }
  }
  

  eliminarEquipo(id: string) {
    if (confirm('¿Está seguro de eliminar este equipo?')) {
      this.http.delete(`${environment.apiUrl}/equipos/${id}`).subscribe({
        next: () => {
          alert('Equipo eliminado exitosamente');
          this.cargarEquipos();
        },
        error: (error) => {
          console.error('Error al eliminar equipo:', error);
          alert('Error al eliminar el equipo');
        }
      });
    }
  }
  
  // El método mostrarDetalles ya está implementado correctamente
  agregarEquipo() {
    this.formularioVisible = true;
    this.equipoForm.reset();
    this.equipoSeleccionado = null;
  }

  cancelar() {
    this.limpiarFormulario();
  }

  private limpiarFormulario() {
    this.formularioVisible = false;
    this.equipoForm.reset();
    this.equipoSeleccionado = null;
  }

  modalVisible = false;
  equipoSeleccionadoDetalles: any = null;

  mostrarDetalles(equipo: any) {
    this.equipoSeleccionadoDetalles = equipo;
    this.modalVisible = true;
  }

  cerrarModal() {
    this.modalVisible = false;
    this.equipoSeleccionadoDetalles = null;
  }

  esComputadorDetalles(equipo: any): boolean {
    return equipo?.tipoEquipo?.nombre.toLowerCase() === 'computador';
  }
  
  

}

