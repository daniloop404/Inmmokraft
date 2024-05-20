import { Component, OnInit } from '@angular/core';
import { CuestionariosService } from '../cuestionarios.service';
import { TestPersonalidadService } from 'src/app/servicios/test-personalidad.service'; // Importar el servicio de test de personalidad
import { Router } from '@angular/router';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.css']
})
export class ListadoComponent implements OnInit {
  cuestionarios: any[] = [];
  testsPersonalidad: any[] = []; // Array para almacenar los tests de personalidad

  constructor(private cuestionariosService: CuestionariosService, private testPersonalidadService: TestPersonalidadService, private router: Router) { }

  verCuestionario(id: string) {
    this.router.navigate(['/cuestionario', id]);
  }

  vertestPersonalidad(id: string) {
    this.router.navigate(['/test-personalidad', id]);
  }

  ngOnInit(): void {
    // Obtener cuestionarios
    this.cuestionariosService.getCuestionarios().subscribe(cuestionarios => {
      this.cuestionarios = cuestionarios;
    });

    // Obtener tests de personalidad
    this.testPersonalidadService.getTestsPersonalidad().subscribe(tests => {
      this.testsPersonalidad = tests;
    });
  }
}