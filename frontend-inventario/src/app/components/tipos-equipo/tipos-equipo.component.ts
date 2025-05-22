import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TipoEquipoService } from '../../services/tipo-equipo.service';

@Component({
  selector: 'app-tipos-equipo',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="tipos-equipo-container">
      <div class="header">
        <h2>Gestión de Tipos de Equipo</h2>
        <button class="btn-primary" (click)="mostrarFormulario()">
          <i class="fas fa-plus"></i> Nuevo Tipo
        </button>
      </div>

      <!-- Formulario de Tipo de Equipo -->
      <div class="modal" *ngIf="formularioVisible">
        <div class="modal-content">
          <div class="modal-header">
            <h3>{{ tipoEquipoSeleccionado ? 'Editar' : 'Nuevo' }} Tipo de Equipo</h3>
            <button class="btn-cerrar" (click)="cancelar()">×</button>
          </div>
          <div class="modal-body">
            <form [formGroup]="tipoEquipoForm" (ngSubmit)="guardarTipoEquipo()">
              <div class="form-group">
                <label>Nombre</label>
                <input type="text" formControlName="nombre" class="form-control">
                <div class="error-message" *ngIf="tipoEquipoForm.get('nombre')?.touched && tipoEquipoForm.get('nombre')?.errors?.['required']">
                  El nombre es requerido
                </div>
              </div>
              <div class="form-group">
                <label>Descripción</label>
                <textarea formControlName="descripcion" rows="3" class="form-control"></textarea>
                <div class="error-message" *ngIf="tipoEquipoForm.get('descripcion')?.touched && tipoEquipoForm.get('descripcion')?.errors?.['required']">
                  La descripción es requerida
                </div>
              </div>
              <div class="modal-footer">
                <button type="submit" class="btn-save" [disabled]="!tipoEquipoForm.valid">
                  <i class="fas fa-save"></i> {{ tipoEquipoSeleccionado ? 'Actualizar' : 'Guardar' }}
                </button>
                <button type="button" class="btn-cancel" (click)="cancelar()">
                  <i class="fas fa-times"></i> Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Lista de Tipos de Equipo -->
      <div class="tipos-list" *ngIf="!formularioVisible">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let tipo of tiposEquipo">
              <td>{{tipo.nombre}}</td>
              <td>{{tipo.descripcion}}</td>
              <td>
                <div class="acciones">
                  <button class="btn-edit" (click)="editarTipoEquipo(tipo)">
                    <i class="fas fa-edit"></i> Editar
                  </button>
                  <button class="btn-delete" (click)="eliminarTipoEquipo(tipo._id)">
                    <i class="fas fa-trash"></i> Eliminar
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .tipos-equipo-container {
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
      font-weight: bold;
    }
    .form-group input, .form-group textarea {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .error-message {
      color: #e74c3c;
      font-size: 0.875rem;
      margin-top: 0.25rem;
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
      background: #f8f9fa;
      font-weight: bold;
    }
    .acciones {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .btn-edit {
      background-color: #17a2b8;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .btn-delete {
      background-color: #dc3545;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .btn-edit:hover {
      background-color: #138496;
    }

    .btn-delete:hover {
      background-color: #c82333;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .btn-primary:hover {
      background-color: #0056b3;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .btn-secondary:hover {
      background-color: #5a6268;
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
      background: white;
      padding: 0;
      border-radius: 8px;
      width: 90%;
      max-width: 500px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .modal-header {
      background: #f8f9fa;
      padding: 1rem;
      border-bottom: 1px solid #dee2e6;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 8px 8px 0 0;
    }

    .modal-header h3 {
      margin: 0;
      color: #333;
    }

    .modal-body {
      padding: 1.5rem;
    }

    .modal-footer {
      padding: 1rem;
      border-top: 1px solid #dee2e6;
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }

    .btn-cerrar {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #666;
    }

    .btn-cerrar:hover {
      color: #333;
    }

    .form-control {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    .form-control:focus {
      border-color: #80bdff;
      outline: 0;
      box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
    }

    .btn-save {
      background-color: #28a745;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-save:hover {
      background-color: #218838;
    }

    .btn-save:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }

    .btn-cancel {
      background-color: #6c757d;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-cancel:hover {
      background-color: #5a6268;
    }
  `]
})
export class TiposEquipoComponent implements OnInit {
  tipoEquipoForm: FormGroup;
  tiposEquipo: any[] = [];
  formularioVisible = false;
  tipoEquipoSeleccionado: any = null;

  constructor(
    private fb: FormBuilder,
    private tipoEquipoService: TipoEquipoService
  ) {
    this.tipoEquipoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''] // Agregamos el campo descripción
    });
  }

  ngOnInit() {
    this.cargarTiposEquipo();
  }

  cargarTiposEquipo() {
    this.tipoEquipoService.getTiposEquipo().subscribe({
      next: (tipos) => {
        console.log('Tipos de equipo cargados:', tipos);
        this.tiposEquipo = tipos;
      },
      error: (error) => {
        console.error('Error al cargar tipos de equipo:', error);
        alert('Error al cargar los tipos de equipo');
      }
    });
  }

  guardarTipoEquipo() {
    if (this.tipoEquipoForm.valid) {
      const tipoEquipoData = this.tipoEquipoForm.value;
      
      if (this.tipoEquipoSeleccionado) {
        // Asegurarse de que el ID existe y está en el formato correcto
        const id = this.tipoEquipoSeleccionado._id;
        console.log('ID del tipo de equipo a actualizar:', id);
        console.log('Datos a actualizar:', tipoEquipoData);

        if (!id) {
          console.error('ID no encontrado');
          alert('Error: No se pudo identificar el tipo de equipo a actualizar');
          return;
        }

        this.tipoEquipoService.actualizarTipoEquipo(id, tipoEquipoData)
          .subscribe({
            next: (response) => {
              console.log('Respuesta de actualización:', response);
              this.cargarTiposEquipo();
              this.limpiarFormulario();
              alert('Tipo de equipo actualizado exitosamente');
            },
            error: (error) => {
              console.error('Error detallado:', error);
              if (error.status === 404) {
                alert('Error: No se encontró el tipo de equipo para actualizar');
              } else {
                alert('Error al actualizar el tipo de equipo: ' + (error.message || 'Error desconocido'));
              }
            }
          });
      } else {
        this.tipoEquipoService.crearTipoEquipo(tipoEquipoData)
          .subscribe({
            next: () => {
              alert('Tipo de equipo creado exitosamente');
              this.cargarTiposEquipo();
              this.limpiarFormulario();
            },
            error: (error) => {
              console.error('Error al crear tipo de equipo:', error);
              alert('Error al crear el tipo de equipo');
            }
          });
      }
    }
  }

  editarTipoEquipo(tipo: any) {
    this.tipoEquipoSeleccionado = tipo;
    this.tipoEquipoForm.patchValue({
      nombre: tipo.nombre,
      descripcion: tipo.descripcion
    });
    this.formularioVisible = true;
  }

  eliminarTipoEquipo(id: string) {
    if (confirm('¿Está seguro de eliminar este tipo de equipo?')) {
      this.tipoEquipoService.eliminarTipoEquipo(id).subscribe({
        next: () => {
          alert('Tipo de equipo eliminado exitosamente');
          this.cargarTiposEquipo();
        },
        error: (error) => {
          console.error('Error al eliminar tipo de equipo:', error);
          alert('Error al eliminar el tipo de equipo');
        }
      });
    }
  }

  mostrarFormulario() {
    this.formularioVisible = true;
    this.tipoEquipoForm.reset();
    this.tipoEquipoSeleccionado = null;
  }

  cancelar() {
    this.limpiarFormulario();
  }

  private limpiarFormulario() {
    this.formularioVisible = false;
    this.tipoEquipoForm.reset();
    this.tipoEquipoSeleccionado = null;
  }
}