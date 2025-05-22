import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="usuarios-container">
      <div class="header">
        <h2>Gestión de Usuarios</h2>
        <button class="btn-primary" (click)="mostrarFormulario()">
          <i class="fas fa-plus"></i> Nuevo Usuario
        </button>
      </div>

      <!-- Formulario de Usuario -->
      <div class="form-container" *ngIf="formularioVisible">
        <form [formGroup]="usuarioForm" (ngSubmit)="guardarUsuario()">
          <div class="form-group">
            <label>Nombres</label>
            <input type="text" formControlName="nombre">
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" formControlName="email">
          </div>
          <div class="form-group">
            <label>Contraseña</label>
            <input type="password" formControlName="password">
          </div>
          <div class="form-group">
            <label>Rol</label>
            <select formControlName="rol">
              <option value="visitante">Visitante</option>
              <option value="administrador">Administrador</option>
            </select>
          </div>
          <div class="form-buttons">
            <button type="submit" class="btn-success">Guardar</button>
            <button type="button" class="btn-secondary" (click)="cancelar()">Cancelar</button>
          </div>
        </form>
      </div>

      <!-- Lista de Usuarios -->
      <div class="usuarios-list" *ngIf="!formularioVisible">
        <table>
          <thead>
            <tr>
              <th>Nombres</th>
              <th>Email</th>
              <th>Departamento</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let usuario of usuarios">
              <td>{{usuario.nombre}}</td>
              <td>{{usuario.email}}</td>
              <td>{{usuario.rol}}</td>
              <td>
                <div class="acciones">
                  <button class="btn-edit" (click)="editarUsuario(usuario)">
                    <i class="fas fa-edit"></i> Editar
                  </button>
                  <button class="btn-delete" (click)="eliminarUsuario(usuario._id)">
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
    .usuarios-container {
      padding: 20px;
      background-color: #f5f5f5;
    }

    .form-buttons {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .header h2 {
      margin: 0;
      color: #333;
    }

    .btn-nuevo {
      background-color: #007bff; 
      color: white;
      border: none;
      padding: 8px 16px;
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
      color: #333;
      font-weight: 500;
    }

    .form-group input, .form-group select {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
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
      padding: 12px 15px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }

    th {
      background-color: #f8f9fa;
      color: #333;
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

    .btn-detalles {
      background-color: #6c757d;
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

    .btn-eliminar {
      background-color: #dc3545;
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

    .btn-desasignar {
      background-color: #ffc107;
      color: black;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
    }

    .btn-nuevo {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    }

    .btn-success {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}
  `]
})
export class UsuariosComponent implements OnInit {
  usuarioForm: FormGroup;
  usuarios: any[] = [];
  formularioVisible = false;
  usuarioSeleccionado: any = null; // Agregamos esta propiedad

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.usuarioForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rol: ['visitante', Validators.required] // Cambiamos el valor por defecto a 'visitante'
    });
  }

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.http.get(`${environment.apiUrl}/usuarios`).subscribe((data: any) => {
      this.usuarios = data;
    });
  }

  guardarUsuario() {
    if (this.usuarioForm.valid) {
      const usuarioData = {...this.usuarioForm.value};
      
      if (this.usuarioSeleccionado) {
        // Si estamos editando un usuario existente
        // Eliminamos la contraseña si está vacía
        if (!usuarioData.password) {
          delete usuarioData.password;
        }
        
        this.http.put(`${environment.apiUrl}/usuarios/${this.usuarioSeleccionado._id}`, usuarioData)
          .subscribe({
            next: () => {
              alert('Usuario actualizado exitosamente');
              this.cargarUsuarios();
              this.formularioVisible = false;
              this.usuarioForm.reset();
              this.usuarioSeleccionado = null;
            },
            error: (error) => {
              console.error('Error al actualizar usuario:', error);
              let mensajeError = 'Error al actualizar el usuario: ';
              if (error.error?.message) {
                mensajeError += error.error.message;
              }
              alert(mensajeError);
            }
          });
      } else {
        // Si estamos creando un nuevo usuario
        this.http.post(`${environment.apiUrl}/usuarios/register`, usuarioData)
          .subscribe({
            next: (response) => {
              alert('Usuario creado exitosamente');
              this.cargarUsuarios();
              this.formularioVisible = false;
              this.usuarioForm.reset();
            },
            error: (error) => {
              console.error('Error al crear usuario:', error);
              let mensajeError = 'Error al crear el usuario: ';
              
              // Manejar diferentes tipos de errores
              if (error.status === 400) {
                if (error.error?.message?.includes('duplicate key')) {
                  mensajeError = 'El correo electrónico ya está registrado. Por favor, use otro correo.';
                } else if (error.error?.message) {
                  mensajeError = error.error.message;
                }
              } else if (error.status === 422) {
                mensajeError = 'Los datos proporcionados no son válidos. Por favor, verifique la información.';
              } else if (error.status === 500) {
                mensajeError = 'Error interno del servidor. Por favor, intente más tarde.';
              } else {
                mensajeError += 'No se pudo completar el registro. Por favor, intente nuevamente.';
              }
              
              alert(mensajeError);
            }
          });
      }
    } else {
      // Mostrar errores de validación del formulario
      let mensajesError = [];
      
      if (this.usuarioForm.get('nombre')?.hasError('required')) {
        mensajesError.push('El nombre es requerido');
      }
      
      if (this.usuarioForm.get('email')?.hasError('required')) {
        mensajesError.push('El correo electrónico es requerido');
      } else if (this.usuarioForm.get('email')?.hasError('email')) {
        mensajesError.push('El formato del correo electrónico no es válido');
      }
      
      if (this.usuarioForm.get('password')?.hasError('required')) {
        mensajesError.push('La contraseña es requerida');
      }
      
      alert(mensajesError.join('\n'));
    }
  }

  editarUsuario(usuario: any) {
    this.usuarioSeleccionado = usuario; // Guardamos el usuario seleccionado
    this.usuarioForm.patchValue({
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol
    });
    // Removemos la validación de contraseña para edición
    const passwordControl = this.usuarioForm.get('password');
    if (passwordControl) {
      passwordControl.clearValidators();
      passwordControl.updateValueAndValidity();
    }
    this.formularioVisible = true;
  }

  cancelar() {
    this.formularioVisible = false;
    this.usuarioForm.reset();
    this.usuarioSeleccionado = null; // Limpiamos el usuario seleccionado
  }

  eliminarUsuario(id: string) {
    if (confirm('¿Está seguro de eliminar este usuario?')) {
      this.http.delete(`${environment.apiUrl}/usuarios/${id}`).subscribe(() => {
        this.cargarUsuarios();
      });
    }
  }

  mostrarFormulario() {
    this.formularioVisible = true;
    this.usuarioForm.reset();
  }
}
