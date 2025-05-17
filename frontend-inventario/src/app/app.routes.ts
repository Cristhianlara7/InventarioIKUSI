import { Routes } from '@angular/router';
import { EmpleadosComponent } from './components/empleados/empleados.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { AuthGuard } from './guards/auth.guard';
import { PerfilComponent } from './components/perfil/perfil.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/auth',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        loadComponent: () => import('./components/auth/auth.component')
          .then(m => m.AuthComponent)
    },
    {
        path: '',
        loadComponent: () => import('./components/layout/layout.component')
          .then(m => m.LayoutComponent),
        canActivate: [AuthGuard],
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./components/dashboard/dashboard.component')
                  .then(m => m.DashboardComponent)
            },
            {
                path: 'perfil',
                component: PerfilComponent
            },
            {
                path: 'equipos',
                loadComponent: () => import('./components/equipos/equipos.component')
                  .then(m => m.EquiposComponent)
            },
            {
                path: 'empleados',
                component: EmpleadosComponent
            },
            {
                path: 'usuarios',
                component: UsuariosComponent
            }
        ]
    }
];
