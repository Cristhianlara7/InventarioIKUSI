import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-equipos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="equipos-container">
      <div class="header">
        <h2>Gestión de Equipos</h2>
        <button class="btn-primary" (click)="mostrarFormulario()">Nuevo Equipo</button>
      </div>

      <!-- Lista de Equipos -->
      <div class="equipos-list">
        <div class="filters">
          <input 
            type="text" 
            [(ngModel)]="filtro" 
            placeholder="Buscar por código o serial..."
            (keyup)="aplicarFiltro()">
      </div>
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Tipo</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Serial</th>
            <th>Usuario Asignado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let equipo of equiposFiltrados">
            <td>{{equipo.codigo}}</td>
            <td>{{equipo.tipoEquipo?.nombre}}</td>
            <td>{{equipo.marca}}</td>
            <td>{{equipo.modelo}}</td>
            <td>{{equipo.serial}}</td>
            <td>{{equipo.usuarioAsignado?.nombre || 'No asignado'}}</td>
            <td>
              <button (click)="editarEquipo(equipo)">Actualizar</button>
              <button (click)="eliminarEquipo(equipo._id)">Eliminar</button>
              <button (click)="asignarEquipo(equipo)" class="btn-asignar">Asignar</button>
              <button (click)="verDetalles(equipo)" class="btn-detalles">Ver Detalles</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Formulario de Equipo -->
    <div class="form-container" *ngIf="formularioVisible">
      <form [formGroup]="equipoForm" (ngSubmit)="guardarEquipo()">
        <div class="form-group">
          <label>Código</label>
          <input type="text" formControlName="codigo" [readonly]="equipoSeleccionado">
        </div>
        <div class="form-group">
          <label>Tipo de Equipo</label>
          <select formControlName="tipoEquipo">
            <option *ngFor="let tipo of tiposEquipo" [value]="tipo._id">
              {{tipo.nombre}}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>Marca</label>
          <input type="text" formControlName="marca">
        </div>
        <div class="form-group">
          <label>Modelo</label>
          <input type="text" formControlName="modelo">
        </div>
        <div class="form-group">
          <label>Serial</label>
          <input type="text" formControlName="serial">
        </div>
        <div class="form-group" *ngIf="esComputador()">
          <label>Memoria RAM</label>
          <input type="text" formControlName="memoriaRam">
        </div>
        <div class="form-group" *ngIf="esComputador()">
          <label>Disco Duro</label>
          <input type="text" formControlName="discoDuro">
        </div>
        <div class="form-group" *ngIf="esComputador()">
          <label>Procesador</label>
          <input type="text" formControlName="procesador">
        </div>
        <div class="form-buttons">
          <button type="submit" class="btn-primary">Guardar</button>
          <button type="button" class="btn-secondary" (click)="cancelar()">Cancelar</button>
        </div>
      </form>
    </div>
    </div>
  `,
  styles: [`
    .equipos-container {
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
    .equipos-list table {
      width: 100%;
      border-collapse: collapse;
    }
    .equipos-list th, .equipos-list td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    .filters {
      margin-bottom: 20px;
    }
    .filters input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .btn-primary {
      background: #2c3e50;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-secondary {
      background: #95a5a6;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      margin-left: 10px;
    }
    .btn-asignar, .btn-detalles {
      background: #2a5298;
      color: white;
      border: none;
      padding: 4px 8px;
      border-radius: 4px;
      cursor: pointer;
      margin-left: 5px;
    }
    .btn-detalles {
      background: #34495e;
    }
  `]
})
export class EquiposComponent implements OnInit {
  equipoForm: FormGroup;
  equipos: any[] = [];
  equiposFiltrados: any[] = [];
  tiposEquipo: any[] = [];
  formularioVisible = false;
  filtro = '';
  equipoSeleccionado: any = null; // Agregamos esta propiedad

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.equipoForm = this.fb.group({
      codigo: ['', Validators.required],
      tipoEquipo: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      serial: ['', Validators.required],
      memoriaRam: [''],
      discoDuro: [''],
      procesador: ['']
    });
  }

  ngOnInit() {
    this.cargarEquipos();
    this.cargarTiposEquipo();
  }

  cargarEquipos() {
    this.http.get(`${environment.apiUrl}/equipos`).subscribe((data: any) => {
      this.equipos = data;
      this.equiposFiltrados = data;
    });
  }

  cargarTiposEquipo() {
    this.http.get(`${environment.apiUrl}/tipos-equipo`).subscribe((data: any) => {
      this.tiposEquipo = data;
    });
  }

  editarEquipo(equipo: any) {
    this.equipoSeleccionado = equipo; // Usamos equipoSeleccionado en lugar de usuarioSeleccionado
    this.equipoForm.patchValue({
      codigo: equipo.codigo,
      tipoEquipo: equipo.tipoEquipo._id,
      marca: equipo.marca,
      modelo: equipo.modelo,
      serial: equipo.serial,
      memoriaRam: equipo.memoriaRam,
      discoDuro: equipo.discoDuro,
      procesador: equipo.procesador
    });
    this.formularioVisible = true;
  }

  guardarEquipo() {
    if (this.equipoForm.valid) {
      const equipo = this.equipoForm.value;
      
      if (this.equipoSeleccionado) {
        // Si estamos editando un equipo existente
        this.http.put(`${environment.apiUrl}/equipos/${this.equipoSeleccionado._id}`, equipo)
          .subscribe({
            next: () => {
              alert('Equipo actualizado exitosamente');
              this.cargarEquipos();
              this.formularioVisible = false;
              this.equipoForm.reset();
              this.equipoSeleccionado = null;
            },
            error: (error) => {
              console.error('Error al actualizar equipo:', error);
              let mensajeError = 'Error al actualizar el equipo. ';
              if (error.error && error.error.message) {
                mensajeError += error.error.message;
              }
              alert(mensajeError);
            }
          });
      } else {
        // Si estamos creando un nuevo equipo
        this.http.post(`${environment.apiUrl}/equipos`, equipo)
          .subscribe({
            next: (response) => {
              this.cargarEquipos();
              this.formularioVisible = false;
              this.equipoForm.reset();
              alert('Equipo guardado exitosamente');
            },
            error: (error) => {
              console.error('Error al guardar el equipo:', error);
              let mensajeError = 'Error al guardar el equipo. ';
              
              if (error.error && error.error.message) {
                mensajeError += error.error.message;
              } else {
                mensajeError += 'Por favor, verifique los datos e intente nuevamente.';
              }
              
              alert(mensajeError);
            }
          });
      }
    }
  }

  cancelar() {
    this.formularioVisible = false;
    this.equipoForm.reset();
    this.equipoSeleccionado = null; // Limpiamos el equipo seleccionado
  }

  eliminarEquipo(id: string) {
    if (confirm('¿Está seguro de eliminar este equipo?')) {
      this.http.delete(`${environment.apiUrl}/equipos/${id}`).subscribe(() => {
        this.cargarEquipos();
      });
    }
  }

  mostrarFormulario() {
    this.formularioVisible = true;
    this.equipoForm.reset();
  }

  aplicarFiltro() {
    this.equiposFiltrados = this.equipos.filter(equipo => 
      equipo.codigo.toLowerCase().includes(this.filtro.toLowerCase()) ||
      equipo.serial.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  asignarEquipo(equipo: any) {
    // Navegar a la página de asignación con el ID del equipo
    this.router.navigate(['/equipos/asignar'], { 
      queryParams: { equipoId: equipo._id }
    });
  }

  verDetalles(equipo: any) {
    // Mostrar los detalles en un modal o diálogo
    const detalles = `
      Código: ${equipo.codigo}
      Tipo: ${equipo.tipoEquipo?.nombre}
      Marca: ${equipo.marca}
      Modelo: ${equipo.modelo}
      Serial: ${equipo.serial}
      Estado: ${equipo.usuarioAsignado ? 'Asignado' : 'Disponible'}
      ${equipo.memoriaRam ? 'Memoria RAM: ' + equipo.memoriaRam : ''}
      ${equipo.discoDuro ? 'Disco Duro: ' + equipo.discoDuro : ''}
      ${equipo.procesador ? 'Procesador: ' + equipo.procesador : ''}
    `;
    alert(detalles); // Por ahora usamos alert, pero se podría mejorar con un modal
  }
  esComputador(): boolean {
    const tipoEquipoId = this.equipoForm.get('tipoEquipo')?.value;
    const tipoEquipo = this.tiposEquipo.find(tipo => tipo._id === tipoEquipoId);
    return tipoEquipo?.nombre.toLowerCase() === 'computador';
  }
}