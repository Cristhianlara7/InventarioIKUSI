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
        <h2>Gestión de Usuarios del Sistema</h2>
        <button class="btn-primary" (click)="mostrarFormulario()">Nuevo Usuario</button>
      </div>

      <!-- Formulario de Usuario -->
      <div class="form-container" *ngIf="formularioVisible">
        <form [formGroup]="usuarioForm" (ngSubmit)="guardarUsuario()">
          <div class="form-group">
            <label>Nombre</label>
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
              <option value="usuario">Usuario</option>
              <option value="administrador">Administrador</option>
            </select>
          </div>
          <div class="form-buttons">
            <button type="submit" class="btn-primary">Guardar</button>
            <button type="button" class="btn-secondary" (click)="cancelar()">Cancelar</button>
          </div>
        </form>
      </div>

      <!-- Lista de Usuarios -->
      <div class="usuarios-list">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let usuario of usuarios">
              <td>{{usuario.nombre}}</td>
              <td>{{usuario.email}}</td>
              <td>{{usuario.rol}}</td>
              <td>
                <button class="btn-editar" (click)="editarUsuario(usuario)">Editar</button>
                <button class="btn-eliminar" (click)="eliminarUsuario(usuario._id)">Eliminar</button>
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
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
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
      rol: ['usuario', Validators.required]
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
      const usuarioData = this.usuarioForm.value;
      
      if (this.usuarioSeleccionado) {
        // Si estamos editando un usuario existente
        this.http.put(`${environment.apiUrl}/usuarios/${this.usuarioSeleccionado._id}`, usuarioData)
          .subscribe({
            next: () => {
              alert('Usuario actualizado exitosamente');
              this.cargarUsuarios();
              this.usuarioForm.reset();
              this.usuarioSeleccionado = null;
            },
            error: (error) => {
              console.error('Error al actualizar usuario:', error);
              alert('Error al actualizar el usuario');
            }
          });
      } else {
        // Si estamos creando un nuevo usuario
        this.http.post(`${environment.apiUrl}/usuarios`, usuarioData)
          .subscribe({
            next: () => {
              alert('Usuario creado exitosamente');
              this.cargarUsuarios();
              this.usuarioForm.reset();
            },
            error: (error) => {
              console.error('Error al crear usuario:', error);
              alert('Error al crear el usuario');
            }
          });
      }
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