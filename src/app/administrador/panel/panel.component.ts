import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CuestionariosService } from 'src/app/cuestionarios/cuestionarios.service';
import { TestPersonalidadService } from 'src/app/servicios/test-personalidad.service';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {
  cuestionarios: any[] = [];
  testsPersonalidad: any[] = [];

  constructor(
    private router: Router,
    private cuestionariosService: CuestionariosService,
    private testPersonalidadService: TestPersonalidadService
  ) { }

  ngOnInit(): void {
    this.actualizarCuestionarios();
    this.actualizarTestsPersonalidad();
  }

  // Métodos para cuestionarios
  agregarCuestionario() {
    this.router.navigate(['/ingresar-cuestionarios']);
  }

  eliminarCuestionario(id: string) {
    this.cuestionariosService.eliminarCuestionario(id).subscribe(() => {
      this.actualizarCuestionarios();
    });
  }

  modificarCuestionario(id: string) {
    this.router.navigate(['/modificar-cuestionario', id]);
  }

  private actualizarCuestionarios() {
    this.cuestionariosService.getCuestionarios().subscribe(cuestionarios => {
      this.cuestionarios = cuestionarios;
    });
  }

  // Métodos para tests de personalidad
  agregarTestPersonalidad() {
    this.router.navigate(['/ingreso-test']);
  }

  eliminarTestPersonalidad(id: string) {
    this.testPersonalidadService.eliminarTestPersonalidad(id).subscribe(() => {
      this.actualizarTestsPersonalidad();
    });
  }

  modificarTestPersonalidad(id: string) {
    this.router.navigate(['/test-personalidad-modificar', id]);
  }

  private actualizarTestsPersonalidad() {
    this.testPersonalidadService.getTestsPersonalidad().subscribe(tests => {
      this.testsPersonalidad = tests;
    });
  }
}