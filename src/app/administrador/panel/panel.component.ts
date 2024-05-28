import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TestPersonalidadService } from 'src/app/servicios/test-personalidad.service';
import { ContactoService } from 'src/app/servicios/contacto.service';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {
  testsPersonalidad: any[] = [];
  contactos: any[] = [];

  mostrarTestsPersonalidad = true;
  mostrarFormularioContacto = true;

  constructor(
    private router: Router,
    private testPersonalidadService: TestPersonalidadService,
    private contactoService: ContactoService
  ) { }

  ngOnInit(): void {
    this.actualizarTestsPersonalidad();
    this.actualizarContactos();
  }

  // Métodos para tests de personalidad
  agregarTestPersonalidad() {
    this.router.navigate(['/ingreso-test']);
  }

  eliminarTestPersonalidad(id: string) {
    // Comprobación de confirmación
    if (confirm(`¿Está seguro de que desea eliminar este test?`)) {
      this.testPersonalidadService.eliminarTestPersonalidad(id).subscribe(() => {
        this.actualizarTestsPersonalidad();
      });
    }
  }

  modificarTestPersonalidad(id: string) {
    this.router.navigate(['/test-personalidad-modificar', id]);
  }

  private actualizarTestsPersonalidad() {
    this.testPersonalidadService.getTestsPersonalidad().subscribe(tests => {
      this.testsPersonalidad = tests;
    });
  }

  // Métodos para contactos
  private actualizarContactos() {
    this.contactoService.getContactos().subscribe(contactos => {
      this.contactos = contactos;
    });
  }

  eliminarContacto(id: string) {
    // Comprobación de confirmación
    if (confirm(`¿Está seguro de que desea eliminar este mensaje?`)) {
      this.contactoService.eliminarContacto(id).subscribe(() => {
        this.actualizarContactos();
      });
    }
  }

  toggleSeccion(seccion: string) {
    if (seccion === 'testsPersonalidad') {
      this.mostrarTestsPersonalidad = !this.mostrarTestsPersonalidad;
    } else if (seccion === 'formularioContacto') {
      this.mostrarFormularioContacto = !this.mostrarFormularioContacto;
    }
  }
}