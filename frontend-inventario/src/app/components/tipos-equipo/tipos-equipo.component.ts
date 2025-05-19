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
        <button class="btn-primary" (click)="mostrarFormulario()">Nuevo Tipo</button>
      </div>

      <!-- Formulario de Tipo de Equipo -->
      <div class="form-container" *ngIf="formularioVisible">
        <form [formGroup]="tipoEquipoForm" (ngSubmit)="guardarTipoEquipo()">
          <div class="form-group">
            <label>Nombre</label>
            <input type="text" formControlName="nombre">
            <div class="error-message" *ngIf="tipoEquipoForm.get('nombre')?.touched && tipoEquipoForm.get('nombre')?.errors?.['required']">
              El nombre es requerido
            </div>
          </div>
          <div class="form-group">
            <label>Descripción</label>
            <textarea formControlName="descripcion" rows="3"></textarea>
            <div class="error-message" *ngIf="tipoEquipoForm.get('descripcion')?.touched && tipoEquipoForm.get('descripcion')?.errors?.['required']">
              La descripción es requerida
            </div>
          </div>
          <div class="form-buttons">
            <button type="submit" class="btn-primary" [disabled]="!tipoEquipoForm.valid">
              {{ tipoEquipoSeleccionado ? 'Actualizar' : 'Guardar' }}
            </button>
            <button type="button" class="btn-secondary" (click)="cancelar()">Cancelar</button>
          </div>
        </form>
      </div>

      <!-- Lista de Tipos de Equipo -->
      <div class="tipos-list">
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
                <button class="btn-edit" (click)="editarTipoEquipo(tipo)">Editar</button>
                <button class="btn-delete" (click)="eliminarTipoEquipo(tipo._id)">Eliminar</button>
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
    .btn-primary {
      background: #2a5298;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-secondary {
      background: #6c757d;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      margin-left: 8px;
    }
    .btn-edit {
      background: #2ecc71;
      color: white;
      border: none;
      padding: 4px 8px;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 4px;
    }
    .btn-delete {
      background: #e74c3c;
      color: white;
      border: none;
      padding: 4px 8px;
      border-radius: 4px;
      cursor: pointer;
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
        this.tipoEquipoService.actualizarTipoEquipo(this.tipoEquipoSeleccionado._id, tipoEquipoData)
          .subscribe({
            next: () => {
              alert('Tipo de equipo actualizado exitosamente');
              this.cargarTiposEquipo();
              this.limpiarFormulario();
            },
            error: (error) => {
              console.error('Error al actualizar tipo de equipo:', error);
              alert('Error al actualizar el tipo de equipo');
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