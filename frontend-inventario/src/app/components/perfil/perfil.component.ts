import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ChangeDetectorRef } from '@angular/core';

interface Usuario {
    id: string;
    nombre: string;
    email: string;
    rol: string;
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="perfil-container">
      <h2>Perfil de Usuario</h2>
      
      <div class="perfil-info" *ngIf="usuario">
        <h3>Información Personal</h3>
        <div class="info-group">
          <label>Nombre:</label>
          <p>{{usuario.nombre}}</p>
        </div>
        <div class="info-group">
          <label>Email:</label>
          <p>{{usuario.email}}</p>
        </div>
      </div>

      <div class="cambiar-password">
        <h3>Cambiar Contraseña</h3>
        <form [formGroup]="passwordForm" (ngSubmit)="cambiarPassword()">
          <div class="form-group">
            <label>Contraseña Actual</label>
            <input type="password" formControlName="passwordActual">
            <div class="error-message" *ngIf="passwordForm.get('passwordActual')?.touched && passwordForm.get('passwordActual')?.errors">
              <span *ngIf="passwordForm.get('passwordActual')?.errors?.['required']">La contraseña actual es requerida</span>
            </div>
          </div>
          <div class="form-group">
            <label>Nueva Contraseña</label>
            <input type="password" formControlName="nuevaPassword">
            <div class="error-message" *ngIf="passwordForm.get('nuevaPassword')?.touched && passwordForm.get('nuevaPassword')?.errors">
              <span *ngIf="passwordForm.get('nuevaPassword')?.errors?.['required']">La nueva contraseña es requerida</span>
              <span *ngIf="passwordForm.get('nuevaPassword')?.errors?.['minlength']">La contraseña debe tener al menos 6 caracteres</span>
            </div>
          </div>
          <div class="form-group">
            <label>Confirmar Nueva Contraseña</label>
            <input type="password" formControlName="confirmarPassword">
            <div class="error-message" *ngIf="passwordForm.get('confirmarPassword')?.touched && passwordForm.errors?.['mismatch']">
              Las contraseñas no coinciden
            </div>
          </div>
          <button type="submit" [disabled]="!passwordForm.valid">
            Cambiar Contraseña
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .perfil-container {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }
    .perfil-info, .cambiar-password {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }
    .form-group {
      margin-bottom: 1rem;
      display: flex;
      gap: 1rem;
      align-items: center;
    }
    .form-group label {
      font-weight: bold;
      min-width: 100px;
    }
    .form-group p {
      margin: 0;
    }
    .form-group input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    button {
      background: #2c3e50;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
    }
    button:disabled {
      background: #95a5a6;
      cursor: not-allowed;
    }
    .error-message {
      color: #e74c3c;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
  `]
})


export class PerfilComponent implements OnInit {
  usuario: Usuario | null = null;
  passwordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.passwordForm = this.fb.group({
      passwordActual: ['', Validators.required],
      nuevaPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmarPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator.bind(this) }); // Agregamos .bind(this)
  }

  ngOnInit() {
    console.log('Iniciando componente de perfil');   
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userLocal = JSON.parse(userStr);
        // Modificar para usar _id en lugar de id
        if (this.isValidUser(userLocal)) {
          this.usuario = {
            id: userLocal.id, // Convertir _id a id
            nombre: userLocal.nombre,
            email: userLocal.email,
            rol: userLocal.rol
          };
          console.log('Usuario válido obtenido del localStorage:', this.usuario);
        } else {
          console.warn('Estructura de usuario inválida en localStorage');
        }
      } catch (e) {
        console.error('Error al parsear usuario del localStorage:', e);
      }
    }
    
    // Actualizar la validación del usuario
    this.authService.getUser().subscribe({
      next: (user) => {
        console.log('Usuario obtenido del servicio:', user);
        if (user && user._id) {
          this.usuario = {
            id: user._id,
            nombre: user.nombre,
            email: user.email,
            rol: user.rol
          };
        } else {
          console.warn('Estructura de usuario inválida del servidor');
        }
      },
      error: (error) => {
        console.error('Error al obtener usuario:', error);
      }
    });
  }

  private isValidUser(user: any): user is Usuario {
    return user && 
           (typeof user.id === 'string' || typeof user._id === 'string') &&
           typeof user.nombre === 'string' && 
           typeof user.email === 'string' && 
           typeof user.rol === 'string';
  }

  cambiarPassword() {
    if (this.passwordForm.invalid) {
      return;
    }

    const formValues = this.passwordForm.value;
    
    if (formValues.nuevaPassword !== formValues.confirmarPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (!this.usuario?.id) {
      alert('Error: Usuario no autenticado');
      return;
    }

    const datos = {
      passwordActual: formValues.passwordActual,
      nuevaPassword: formValues.nuevaPassword,
      userId: this.usuario.id
    };

    this.authService.cambiarPassword(datos).subscribe({
      next: (response: any) => {
        alert('Contraseña actualizada exitosamente');
        this.passwordForm.reset();
      },
      error: (error) => {
        console.error('Error al cambiar la contraseña:', error);
        const mensajeError = error.error?.message || 'Error al cambiar la contraseña';
        alert(mensajeError);
      }
    });
  }

  // Agregar el método passwordMatchValidator
  private passwordMatchValidator(group: FormGroup): {[key: string]: any} | null {
    const nuevaPassword = group.get('nuevaPassword');
    const confirmarPassword = group.get('confirmarPassword');

    if (!nuevaPassword || !confirmarPassword) {
      return null;
    }

    return nuevaPassword.value === confirmarPassword.value
      ? null
      : { 'mismatch': true };
  }
}