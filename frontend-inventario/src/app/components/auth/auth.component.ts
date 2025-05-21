import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginResponse } from '../../interfaces/auth.interface';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h2>{{ isLoginMode ? 'Iniciar Sesión' : 'Registro' }}</h2>
        </div>
        
        <form [formGroup]="authForm" (ngSubmit)="onSubmit()">
          <div class="form-group" *ngIf="!isLoginMode">
            <label>Nombre</label>
            <input type="text" formControlName="nombre" class="form-control">
          </div>
          
          <div class="form-group">
            <label>Email</label>
            <input type="email" formControlName="email" class="form-control">
          </div>
          
          <div class="form-group">
            <label>Contraseña</label>
            <input type="password" formControlName="password" class="form-control">
          </div>
          
          <button type="submit" class="btn-primary">
            {{ isLoginMode ? 'Iniciar Sesión' : 'Registrarse' }}
          </button>
          
          <p class="auth-switch">
            {{ isLoginMode ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?' }}
            <a (click)="toggleMode()">
              {{ isLoginMode ? 'Regístrate' : 'Inicia Sesión' }}
            </a>
          </p>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
    }
    
    .auth-card {
      background: white;
      padding: 2rem;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }
    
    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .auth-header h2 {
      color: #2c3e50;
      margin: 0;
    }
    
    .form-group {
      margin-bottom: 1.5rem;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: #2c3e50;
    }
    
    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      transition: border-color 0.3s;
    }
    
    .form-control:focus {
      border-color: #2a5298;
      outline: none;
    }
    
    .btn-primary {
      width: 100%;
      padding: 0.75rem;
      background: #2a5298;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.3s;
    }
    
    .btn-primary:hover {
      background: #1e3c72;
    }
    
    .auth-switch {
      text-align: center;
      margin-top: 1rem;
    }
    
    .auth-switch a {
      color: #2a5298;
      cursor: pointer;
      text-decoration: underline;
    }
  `]
})
export class AuthComponent {
  authForm: FormGroup;
  isLoginMode = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.authForm = this.fb.group({
      nombre: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    if (this.isLoginMode) {
      this.authForm.get('nombre')?.clearValidators();
    } else {
      this.authForm.get('nombre')?.setValidators(Validators.required);
    }
    this.authForm.get('nombre')?.updateValueAndValidity();
  }


  onSubmit() {
    if (this.authForm.valid) {
      if (this.isLoginMode) {
        const credentials = {
          email: this.authForm.value.email,
          password: this.authForm.value.password
        };
        
        this.authService.login(credentials).subscribe({
          next: (response: LoginResponse) => {
            if (response && response.token) {
              localStorage.setItem('token', response.token);
              localStorage.setItem('user', JSON.stringify(response.user));
              
              if (this.authService.isAuthenticated()) {
                this.router.navigate(['/dashboard'])
                  .then(() => window.dispatchEvent(new CustomEvent('loginSuccess')))
                  .catch(err => {
                    console.error('Error en la navegación:', err);
                    alert('Error al navegar al dashboard');
                  });
              }
            }
          },
          error: (error) => {
            console.error('Error de inicio de sesión:', error);
            let mensajeError = 'Error al iniciar sesión: ';
            if (error.error?.message) {
              mensajeError += error.error.message;
            } else {
              mensajeError += 'Credenciales inválidas';
            }
            alert(mensajeError);
          }
        });
      } else {
        // Modo registro
        const userData = {
          nombre: this.authForm.value.nombre,
          email: this.authForm.value.email,
          password: this.authForm.value.password
        };
        
        this.authService.register(userData).subscribe({
          next: () => {
            alert('Registro exitoso. Por favor inicia sesión.');
            this.isLoginMode = true;
            this.authForm.reset();
          },
          error: (error) => {
            console.error('Error de registro:', error);
            let mensajeError = 'Error al registrar: ';
            if (error.error?.message) {
              mensajeError += error.error.message;
            } else {
              mensajeError += 'No se pudo completar el registro';
            }
            alert(mensajeError);
          }
        });
      }
    }
  }}
  