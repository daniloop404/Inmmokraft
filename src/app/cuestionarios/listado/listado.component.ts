import { Component, OnInit } from '@angular/core';
import { TestPersonalidadService } from 'src/app/servicios/test-personalidad.service';
import { ResultadosService } from 'src/app/servicios/resultados.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.css']
})
export class ListadoComponent implements OnInit {
  testsPersonalidad: any[] = [];
  resultadosPersonalidad: any = {};
  uid: string;

  constructor(
    private testPersonalidadService: TestPersonalidadService,
    private resultadosService: ResultadosService,
    private usuariosService: UsuariosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuariosService.getEstadoAutenticacion().subscribe(user => {
      if (user) {
        this.uid = user.uid;
        this.obtenerTestsPersonalidad();
        this.obtenerResultadosUsuario();
      }
    });
  }

  obtenerTestsPersonalidad(): void {
    this.testPersonalidadService.getTestsPersonalidad().subscribe(tests => {
      this.testsPersonalidad = tests;
    });
  }

  obtenerResultadosUsuario(): void {
    this.resultadosService.obtenerDatosUsuario(this.uid).subscribe(data => {
      const userKey = Object.keys(data).find(key => data[key].uid === this.uid);
      if (userKey) {
        this.resultadosPersonalidad = data[userKey].resultadosPersonalidad || {};
      }
    });
  }

  vertestPersonalidad(id: string): void {
    this.router.navigate(['/test-personalidad', id]);
  }

  esTestCompletado(testId: string): boolean {
    return Object.values(this.resultadosPersonalidad).some((resultado: any) => resultado.testId === testId);
  }
}