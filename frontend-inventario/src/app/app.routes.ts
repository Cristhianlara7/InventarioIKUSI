import { Routes } from '@angular/router';
import { AsignarEquipoComponent } from './components/equipos/asignar-equipo.component';
import { EquiposComponent } from './components/equipos/equipos.component';
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
                component: EquiposComponent
            },
            {
                path: 'equipos/asignar',
                component: AsignarEquipoComponent
            },
            {
                path: 'empleados',
                component: EmpleadosComponent
            },
            {
                path: 'usuarios',
                component: UsuariosComponent
            },
            {
                path: 'tipos-equipo',
                loadComponent: () => import('./components/tipos-equipo/tipos-equipo.component')
                  .then(m => m.TiposEquipoComponent)
            },
            {
                path: 'reportes',
                loadComponent: () => import('./components/reportes/reportes.component')
                  .then(m => m.ReportesComponent)
            }
        ]
    }
];
