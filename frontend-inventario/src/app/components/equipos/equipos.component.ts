import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-equipos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  styles: [`
    .table-container {
      overflow-x: auto;
      margin: 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 0;
    }

    th {
      background-color: #f8f9fa;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      color: #2c3e50;
      border-bottom: 2px solid #dee2e6;
    }

    td {
      padding: 12px;
      border-bottom: 1px solid #dee2e6;
      color: #2c3e50;
    }

    tr:hover {
      background-color: #f8f9fa;
    }

    .acciones {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .btn {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .btn-actualizar {
      background-color: #17a2b8;
      color: white;
    }

    .btn-actualizar:hover {
      background-color: #138496;
    }

    .btn-eliminar {
      background-color: #dc3545;
      color: white;
    }

    .btn-eliminar:hover {
      background-color: #c82333;
    }

    .btn-asignar {
      background-color: #28a745;
      color: white;
    }

    .btn-asignar:hover {
      background-color: #218838;
    }

    .btn-detalles {
      background-color: #6c757d;
      color: white;
    }

    .btn-detalles:hover {
      background-color: #5a6268;
    }

    .search-container {
      margin: 20px;
      display: flex;
      gap: 10px;
    }

    input[type="text"] {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid #ced4da;
      border-radius: 4px;
      font-size: 1rem;
    }

    .btn-nuevo {
      background-color: #007bff;
      color: white;
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .btn-nuevo:hover {
      background-color: #0056b3;
    }

    .formulario-container {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .formulario {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      width: 100%;
      max-width: 500px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    .form-group input,
    .form-group select {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ced4da;
      border-radius: 4px;
      font-size: 1rem;
    }

    .botones {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .btn-guardar {
      background-color: #28a745;
      color: white;
    }

    .btn-guardar:hover {
      background-color: #218838;
    }

    .btn-guardar:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }

    .btn-cancelar {
      background-color: #dc3545;
      color: white;
    }

    .btn-cancelar:hover {
      background-color: #c82333;
    }
  
    .table-container {
      overflow-x: auto;
      margin: 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 0;
    }

    th {
      background-color: #f8f9fa;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      color: #2c3e50;
      border-bottom: 2px solid #dee2e6;
    }

    td {
      padding: 12px;
      border-bottom: 1px solid #dee2e6;
      color: #2c3e50;
    }

    tr:hover {
      background-color: #f8f9fa;
    }

    .acciones {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .btn {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .btn-actualizar {
      background-color: #17a2b8;
      color: white;
    }

    .btn-actualizar:hover {
      background-color: #138496;
    }

    .btn-eliminar {
      background-color: #dc3545;
      color: white;
    }

    .btn-eliminar:hover {
      background-color: #c82333;
    }

    .btn-asignar {
      background-color: #28a745;
      color: white;
    }

    .btn-asignar:hover {
      background-color: #218838;
    }

    .btn-detalles {
      background-color: #6c757d;
      color: white;
    }

    .btn-detalles:hover {
      background-color: #5a6268;
    }

    .search-container {
      margin: 20px;
      display: flex;
      gap: 10px;
    }

    input[type="text"] {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid #ced4da;
      border-radius: 4px;
      font-size: 1rem;
    }

    .btn-nuevo {
      background-color: #007bff;
      color: white;
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .btn-nuevo:hover {
      background-color: #0056b3;
    }

    .formulario-container {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .formulario {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      width: 100%;
      max-width: 500px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    .form-group input,
    .form-group select {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ced4da;
      border-radius: 4px;
      font-size: 1rem;
    }

    .botones {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .btn-guardar {
      background-color: #28a745;
      color: white;
    }

    .btn-guardar:hover {
      background-color: #218838;
    }

    .btn-guardar:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }

    .btn-cancelar {
      background-color: #dc3545;
      color: white;
    }
      .btn-desasignar {
  background-color: #ffc107;
  color: black;
}

.btn-desasignar:hover {
  background-color: #e0a800;
}

    .btn-cancelar:hover {
      background-color: #c82333;
    }
  `],
  template: `
    <div class="search-container">
      <input 
        type="text" 
        placeholder="Buscar por código o serial..." 
        [(ngModel)]="searchTerm"
        (ngModelChange)="filtrarEquipos()"
      >
      <button class="btn btn-nuevo" (click)="agregarEquipo()">
        Nuevo Equipo
      </button>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Tipo</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Serial</th>
            <th>Usuario Asignado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let equipo of equiposFiltrados">
            <td>{{equipo.codigo}}</td>
            <td>{{equipo.tipoEquipo?.nombre}} - {{equipo.tipoEquipo?.descripcion || 'Sin descripción'}}</td>
            <td>{{equipo.marca}}</td>
            <td>{{equipo.modelo}}</td>
            <td>{{equipo.serial}}</td>
            <td>
              {{equipo.empleadoAsignado ? 
                (equipo.empleadoAsignado.nombres + ' ' + equipo.empleadoAsignado.apellidos) : 
                'No asignado'}}
            </td>
            <td class="acciones">
              <button class="btn btn-actualizar" (click)="editarEquipo(equipo)">
                Actualizar
              </button>
              <button class="btn btn-eliminar" (click)="eliminarEquipo(equipo)">
                Eliminar
              </button>
              <button class="btn btn-asignar" (click)="asignarEquipo(equipo)" *ngIf="!equipo.empleadoAsignado">
                Asignar
              </button>
              <button class="btn btn-desasignar" (click)="desasignarEquipo(equipo)" *ngIf="equipo.empleadoAsignado">
                Desasignar
              </button>
              <button class="btn btn-detalles" (click)="verDetalles(equipo)">
                Ver Detalles
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Agregar el formulario -->
    <div class="formulario-container" *ngIf="formularioVisible">
      <div class="formulario">
        <h3>{{equipoSeleccionado ? 'Editar Equipo' : 'Nuevo Equipo'}}</h3>
        <form [formGroup]="equipoForm" (ngSubmit)="guardarEquipo()">
          <div class="form-group">
            <label>Código:</label>
            <input type="text" formControlName="codigo">
          </div>
          
          <div class="form-group">
            <label>Tipo de Equipo:</label>
            <select formControlName="tipoEquipo">
              <option value="">Seleccione un tipo</option>
              <option *ngFor="let tipo of tiposEquipo" [value]="tipo._id">
                {{tipo.nombre}}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Marca:</label>
            <input type="text" formControlName="marca">
          </div>

          <div class="form-group">
            <label>Modelo:</label>
            <input type="text" formControlName="modelo">
          </div>

          <div class="form-group">
            <label>Serial:</label>
            <input type="text" formControlName="serial">
          </div>

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

          <div class="botones">
            <button type="submit" class="btn btn-guardar" [disabled]="!equipoForm.valid">
              Guardar
            </button>
            <button type="button" class="btn btn-cancelar" (click)="cancelar()">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
`,
  })

export class EquiposComponent implements OnInit {
  equipoForm: FormGroup;
  equipos: any[] = [];
  equiposFiltrados: any[] = [];
  tiposEquipo: any[] = [];
  formularioVisible = false;
  searchTerm: string = '';
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

  ngOnInit() {
    this.cargarEquipos();
    this.cargarTiposEquipo();
  }

  cargarEquipos() {
    this.http.get(`${environment.apiUrl}/equipos`).subscribe((data: any) => {
      this.equipos = data;
      this.equiposFiltrados = this.equipos.map(equipo => {
        return {
          ...equipo,
          tipoEquipo: {
            ...equipo.tipoEquipo,
            descripcion: equipo.tipoEquipo?.descripcion || 'Sin descripción'
          },
          empleadoAsignado: equipo.empleadoAsignado ? {
            nombres: equipo.empleadoAsignado.nombres,
            apellidos: equipo.empleadoAsignado.apellidos
          } : null
        };
      });
    });
  }

  cargarTiposEquipo() {
    this.http.get(`${environment.apiUrl}/tipos-equipo`).subscribe((data: any) => {
      this.tiposEquipo = data;
    });
  }

  editarEquipo(equipo: any) {
    this.equipoSeleccionado = equipo; // Usamos equipoSeleccionado en lugar de usuarioSeleccionado
    this.equipoForm.patchValue({
      codigo: equipo.codigo,
      tipoEquipo: equipo.tipoEquipo._id,
      marca: equipo.marca,
      modelo: equipo.modelo,
      serial: equipo.serial,
      memoriaRam: equipo.memoriaRam,
      discoDuro: equipo.discoDuro,
      procesador: equipo.procesador
    });
    this.formularioVisible = true;
  }

  guardarEquipo() {
    if (this.equipoForm.valid) {
      const equipo = this.equipoForm.value;
      
      if (this.equipoSeleccionado) {
        // Si estamos editando un equipo existente
        this.http.put(`${environment.apiUrl}/equipos/${this.equipoSeleccionado._id}`, equipo)
          .subscribe({
            next: () => {
              alert('Equipo actualizado exitosamente');
              this.cargarEquipos();
              this.formularioVisible = false;
              this.equipoForm.reset();
              this.equipoSeleccionado = null;
            },
            error: (error) => {
              console.error('Error al actualizar equipo:', error);
              let mensajeError = 'Error al actualizar el equipo. ';
              if (error.error && error.error.message) {
                mensajeError += error.error.message;
              }
              alert(mensajeError);
            }
          });
      } else {
        // Si estamos creando un nuevo equipo
        this.http.post(`${environment.apiUrl}/equipos`, equipo)
          .subscribe({
            next: (response) => {
              this.cargarEquipos();
              this.formularioVisible = false;
              this.equipoForm.reset();
              alert('Equipo guardado exitosamente');
            },
            error: (error) => {
              console.error('Error al guardar el equipo:', error);
              let mensajeError = 'Error al guardar el equipo. ';
              
              if (error.error && error.error.message) {
                mensajeError += error.error.message;
              } else {
                mensajeError += 'Por favor, verifique los datos e intente nuevamente.';
              }
              
              alert(mensajeError);
            }
          });
      }
    }
  }

  cancelar() {
    this.formularioVisible = false;
    this.equipoForm.reset();
    this.equipoSeleccionado = null; // Limpiamos el equipo seleccionado
  }

  eliminarEquipo(equipo: any) {
    if (confirm('¿Está seguro de eliminar este equipo?')) {
      this.http.delete(`${environment.apiUrl}/equipos/${equipo._id}`).subscribe(() => {
        this.cargarEquipos();
      });
    }
  }

  // Eliminar completamente el método aplicarFiltro() ya que es redundante
  // y usar solo filtrarEquipos()

  asignarEquipo(equipo: any) {
    // Navegar a la página de asignación con el ID del equipo
    this.router.navigate(['/equipos/asignar'], { 
      queryParams: { equipoId: equipo._id }
    });
  }

  verDetalles(equipo: any) {
    // Mostrar los detalles en un modal o diálogo
    const detalles = `
      Código: ${equipo.codigo}
      Tipo: ${equipo.tipoEquipo?.nombre}
      Marca: ${equipo.marca}
      Modelo: ${equipo.modelo}
      Serial: ${equipo.serial}
      Estado: ${equipo.usuarioAsignado ? 'Asignado' : 'Disponible'}
      ${equipo.memoriaRam ? 'Memoria RAM: ' + equipo.memoriaRam : ''}
      ${equipo.discoDuro ? 'Disco Duro: ' + equipo.discoDuro : ''}
      ${equipo.procesador ? 'Procesador: ' + equipo.procesador : ''}
    `
    alert(detalles); // Por ahora usamos alert, pero se podría mejorar con un modal
  }
  esComputador(): boolean {
    const tipoEquipoId = this.equipoForm.get('tipoEquipo')?.value;
    const tipoEquipo = this.tiposEquipo.find(tipo => tipo._id === tipoEquipoId);
    return tipoEquipo?.nombre.toLowerCase() === 'computador';
  }

  agregarEquipo() {
    this.equipoSeleccionado = null; // Limpiar cualquier equipo seleccionado previamente
    this.equipoForm.reset(); // Resetear el formulario
    this.formularioVisible = true; // Mostrar el formulario
  }

  // Agregar método para filtrar equipos
  filtrarEquipos() {
    if (!this.searchTerm) {
      this.equiposFiltrados = [...this.equipos];
      return;
    }
    
    const termino = this.searchTerm.toLowerCase();
    this.equiposFiltrados = this.equipos.filter(equipo => 
      equipo.codigo?.toLowerCase().includes(termino) ||
      equipo.serial?.toLowerCase().includes(termino) ||
      equipo.marca?.toLowerCase().includes(termino) ||
      equipo.modelo?.toLowerCase().includes(termino)
    );
  }

  desasignarEquipo(equipo: any) {
    if (confirm('¿Está seguro de desasignar este equipo?')) {
      this.http.post(`${environment.apiUrl}/equipos/${equipo._id}/desasignar`, {})
        .subscribe({
          next: () => {
            alert('Equipo desasignado exitosamente');
            this.cargarEquipos();
          },
          error: (error) => {
            console.error('Error al desasignar equipo:', error);
            let mensajeError = 'Error al desasignar el equipo: ';
            if (error.error?.message) {
              mensajeError += error.error.message;
            } else {
              mensajeError += 'Error de conexión con el servidor';
            }
            alert(mensajeError);
          }
        });
    }
  }
}

