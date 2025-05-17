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
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit() {
    console.log('Iniciando componente de perfil');   
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userLocal = JSON.parse(userStr);
        if (this.isValidUser(userLocal)) {
          this.usuario = userLocal;
          console.log('Usuario válido obtenido del localStorage:', userLocal);
        } else {
          console.warn('Estructura de usuario inválida en localStorage');
        }
      } catch (e) {
        console.error('Error al parsear usuario del localStorage:', e);
      }
    }
    
    this.authService.getUser().subscribe({
      next: (user) => {
        console.log('Usuario obtenido del servicio:', user);
        if (this.isValidUser(user)) {
          this.usuario = user;
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
           typeof user.id === 'string' &&
           typeof user.nombre === 'string' && 
           typeof user.email === 'string' && 
           typeof user.rol === 'string';
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('nuevaPassword')?.value === g.get('confirmarPassword')?.value
      ? null : {'mismatch': true};
  }

  cambiarPassword() {
    if (this.passwordForm.valid) {
      this.authService.cambiarPassword(this.passwordForm.value).subscribe({
        next: () => {
          alert('Contraseña actualizada exitosamente');
          this.passwordForm.reset();
        },
        error: (error) => {
          let mensajeError = 'Error al cambiar la contraseña: ';
          if (error.error?.message) {
            mensajeError += error.error.message;
          } else if (error.message) {
            mensajeError += error.message;
          } else {
            mensajeError += 'Error desconocido';
          }
          alert(mensajeError);
        }
      });
    } else {
      Object.keys(this.passwordForm.controls).forEach(key => {
        const control = this.passwordForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }
}