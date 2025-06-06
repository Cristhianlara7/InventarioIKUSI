import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="empleados-container">
      <div class="header">
        <h2>Gestión de Empleados</h2>
        <button class="btn-primary" (click)="mostrarFormulario()">
          <i class="fas fa-plus"></i> Nuevo Empleado
        </button>
      </div>

      <!-- Formulario de Empleado -->
      <div class="form-container" *ngIf="formularioVisible">
        <form [formGroup]="empleadoForm" (ngSubmit)="guardarEmpleado()">
          <div class="form-group">
            <label>Nombres</label>
            <input type="text" formControlName="nombres">
          </div>
          <div class="form-group">
            <label>Apellidos</label>
            <input type="text" formControlName="apellidos">
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" formControlName="email">
          </div>
          <div class="form-group">
            <label>Departamento</label>
            <input type="text" formControlName="departamento">
          </div>
          <div class="form-buttons">
            <button type="submit" class="btn-success" [disabled]="!empleadoForm.valid">
              <i class="fas fa-save"></i> {{ empleadoSeleccionado ? 'Actualizar' : 'Guardar' }}
            </button>
            <button type="button" class="btn-secundary" (click)="cancelar()">
              <i class="fas fa-times"></i> Cancelar
            </button>
          </div>
        </form>
      </div>

      <!-- Lista de Empleados -->
      <div class="empleados-list" *ngIf="!formularioVisible">
        <table>
          <thead>
            <tr>
              <th>Nombres</th>
              <th>Apellidos</th>
              <th>Email</th>
              <th>Departamento</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let empleado of empleados">
              <td>{{empleado.nombres}}</td>
              <td>{{empleado.apellidos}}</td>
              <td>{{empleado.email}}</td>
              <td>{{empleado.departamento}}</td>
              <td>
                <div class="acciones">
                  <button class="btn-edit" (click)="editarEmpleado(empleado)">
                    <i class="fas fa-edit"></i> Editar
                  </button>
                  <button class="btn-delete" (click)="eliminarEmpleado(empleado._id)">
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
    .empleados-container {
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
    .form-group input {
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
    .form-buttons {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }

    .btn-success {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

    .btn-save {
      background-color: #28a745;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      transition: background-color 0.3s;
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
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      transition: background-color 0.3s;
    }

    .btn-cancel:hover {
      background-color: #5a6268;
    }

    .form-container {
      background: white;
      padding: 25px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 20px;
      max-width: 600px;
      margin: 0 auto;
    }
  `]
})
export class EmpleadosComponent implements OnInit {
  empleadoForm: FormGroup;
  empleados: any[] = [];
  formularioVisible = false;
  empleadoSeleccionado: any = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.empleadoForm = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      departamento: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.cargarEmpleados();
  }

  cargarEmpleados() {
    this.http.get(`${environment.apiUrl}/empleados`).subscribe({
      next: (data: any) => {
        console.log('Empleados cargados:', data); // Agregar log para debugging
        this.empleados = data;
      },
      error: (error) => {
        console.error('Error al cargar empleados:', error);
      }
    });
  }

  guardarEmpleado() {
    if (this.empleadoForm.valid) {
      const empleadoData = this.empleadoForm.value;
      
      if (this.empleadoSeleccionado) {
        this.http.put(`${environment.apiUrl}/empleados/${this.empleadoSeleccionado._id}`, empleadoData)
          .subscribe({
            next: () => {
              alert('Empleado actualizado exitosamente');
              this.cargarEmpleados();
              this.formularioVisible = false;
              this.empleadoForm.reset();
              this.empleadoSeleccionado = null;
            },
            error: (error) => {
              console.error('Error al actualizar empleado:', error);
              alert('Error al actualizar el empleado');
            }
          });
      } else {
        this.http.post(`${environment.apiUrl}/empleados`, empleadoData)
          .subscribe({
            next: (response) => {
              console.log('Respuesta del servidor:', response);
              alert('Empleado creado exitosamente');
              this.cargarEmpleados(); // Asegurarnos de que esto se ejecute
              this.formularioVisible = false;
              this.empleadoForm.reset();
            },
            error: (error) => {
              console.error('Error completo:', error);
              let mensajeError = 'Error al crear empleado: ';
              if (error.error?.message) {
                mensajeError += error.error.message;
              } else if (error.status === 400) {
                mensajeError += 'Datos inválidos o faltantes';
              } else if (error.status === 409) {
                mensajeError += 'El email ya está registrado';
              } else {
                mensajeError += 'Error de conexión con el servidor';
              }
              alert(mensajeError);
            }
          });
      }
    } else {
      alert('Por favor, complete todos los campos correctamente');
    }
  }

  editarEmpleado(empleado: any) {
    this.empleadoSeleccionado = empleado;
    this.empleadoForm.patchValue({
      nombres: empleado.nombres,
      apellidos: empleado.apellidos,
      email: empleado.email,
      departamento: empleado.departamento
    });
    this.formularioVisible = true;
  }

  eliminarEmpleado(id: string) {
    if (confirm('¿Está seguro de eliminar este empleado?')) {
      this.http.delete(`${environment.apiUrl}/empleados/${id}`).subscribe({
        next: () => {
          alert('Empleado eliminado exitosamente');
          this.cargarEmpleados();
        },
        error: (error) => {
          console.error('Error al eliminar empleado:', error);
          alert('Error al eliminar el empleado');
        }
      });
    }
  }

  mostrarFormulario() {
    this.formularioVisible = true;
    this.empleadoForm.reset();
    this.empleadoSeleccionado = null;
  }

  cancelar() {
    this.formularioVisible = false;
    this.empleadoForm.reset();
    this.empleadoSeleccionado = null;
  }
}