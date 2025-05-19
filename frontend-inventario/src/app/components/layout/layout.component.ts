import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';  // Add this import
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, CommonModule],  // Add CommonModule here
  template: `
    <div class="app-container">
      <nav class="navbar">
        <div class="nav-brand">Sistema de Inventario</div>
        <div class="nav-links">
          <a routerLink="/dashboard">Dashboard</a>
          <a routerLink="/equipos">Equipos</a>
          <ng-container *ngIf="!esVisitante()">
            <a routerLink="/tipos-equipo">Tipos de Equipo</a>
            <a routerLink="/usuarios">Usuarios</a>
            <a routerLink="/empleados">Empleados</a>
            <a routerLink="/reportes">Reportes</a>
          </ng-container>
          <a routerLink="/perfil">Mi Perfil</a>
          <button class="logout-btn" (click)="logout()">Cerrar Sesión</button>
        </div>
      </nav>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .logout-btn {
    background: transparent;
    border: 1px solid white;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 1rem;
    transition: all 0.3s;
  }
  
  .logout-btn:hover {
    background: white;
    color: #2c3e50;
  }
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .navbar {
      background: #2c3e50;
      padding: 1rem;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .nav-brand {
      font-size: 1.5rem;
      font-weight: bold;
    }
    .nav-links a {
      color: white;
      text-decoration: none;
      margin-left: 1rem;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.3s;
    }
    .nav-links a:hover {
      background-color: #34495e;
    }
    .main-content {
      flex: 1;
      padding: 2rem;
      background: #f5f6fa;
    }
  `]
})
export class LayoutComponent {
    constructor(
        private authService: AuthService,
        private router: Router
    ) {}
    
    esVisitante(): boolean {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            return user.rol === 'visitante';
        }
        return false;
    }
    
    logout() {
        this.authService.logout();
        this.router.navigate(['/auth']);
    }
}