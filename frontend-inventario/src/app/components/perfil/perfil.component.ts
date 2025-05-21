import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

interface Usuario {
    id?: string;
    _id: string;  // Hacemos _id requerido y id opcional
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
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this.passwordForm = this.fb.group({
      passwordActual: ['', Validators.required],
      nuevaPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmarPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator.bind(this) }); // Agregamos .bind(this)
  }

  ngOnInit() {
      console.log('Iniciando componente de perfil');   
      // Primero verificamos si hay un token válido
      const token = this.authService.getToken();
      if (!token) {
          console.error('No hay token disponible');
          this.router.navigate(['/auth']);
          return;
      }
  
      // Intentamos obtener el usuario del localStorage primero
      const userStr = localStorage.getItem('user');
      if (userStr) {
          try {
              const userLocal = JSON.parse(userStr);
              this.usuario = {
                  _id: userLocal._id || '',
                  nombre: userLocal.nombre || '',
                  email: userLocal.email || '',
                  rol: userLocal.rol || ''
              };
              this.cdr.detectChanges();
          } catch (e) {
              console.error('Error al parsear usuario del localStorage:', e);
          }
      }
  
      // Actualizamos con el servicio
      this.authService.getUser().subscribe({
          next: (user) => {
              if (user) {
                  this.usuario = {
                      _id: user._id,
                      nombre: user.nombre,
                      email: user.email,
                      rol: user.rol
                  };
                  localStorage.setItem('user', JSON.stringify(this.usuario));
                  this.cdr.detectChanges();
              }
          },
          error: (error) => {
              console.error('Error al obtener usuario:', error);
              if (error.status === 401) {
                  this.authService.logout();
                  this.router.navigate(['/auth']);
              }
          }
      });
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

    // Verificamos que tengamos el token
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Error: No hay sesión activa');
        return;
    }

    this.authService.cambiarPassword({
        passwordActual: formValues.passwordActual,
        nuevaPassword: formValues.nuevaPassword
    }).subscribe({
        next: (response) => {
            alert('Contraseña actualizada exitosamente');
            this.passwordForm.reset();
        },
        error: (error) => {
            console.error('Error al cambiar contraseña:', error);
            let mensajeError = 'Error al cambiar la contraseña: ';
            
            if (error.error?.message) {
                mensajeError += error.error.message;
            } else if (error.status === 401) {
                mensajeError += 'La contraseña actual es incorrecta';
                // Si el token expiró, redirigimos al login
                if (error.error?.message?.includes('token')) {
                    localStorage.clear();
                    window.location.href = '/auth';
                }
            } else {
                mensajeError += 'Error al procesar la solicitud';
            }
            
            alert(mensajeError);
        }
    });
}

  private obtenerIdUsuario(): string | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user._id || user.id || null;
      } catch {
        return null;
      }
    }
    return null;
  }

  private isValidUser(user: any): user is Usuario {
    return user && 
           (typeof user.id === 'string' || typeof user._id === 'string') &&
           typeof user.nombre === 'string' && 
           typeof user.email === 'string' && 
           typeof user.rol === 'string';
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