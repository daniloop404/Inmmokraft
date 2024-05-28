import { Component, OnInit } from '@angular/core';
import { TestPersonalidadService } from 'src/app/servicios/test-personalidad.service'; // Importar el servicio de test de personalidad
import { Router } from '@angular/router';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.css']
})
export class ListadoComponent implements OnInit {
  testsPersonalidad: any[] = []; // Array para almacenar los tests de personalidad

  constructor(private testPersonalidadService: TestPersonalidadService, private router: Router) { }

  vertestPersonalidad(id: string) {
    this.router.navigate(['/test-personalidad', id]);
  }

  ngOnInit(): void {
    // Obtener tests de personalidad
    this.testPersonalidadService.getTestsPersonalidad().subscribe(tests => {
      this.testsPersonalidad = tests;
    });
  }
}