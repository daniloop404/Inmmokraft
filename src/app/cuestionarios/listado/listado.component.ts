import { Component, OnInit } from '@angular/core';
import { CuestionariosService } from '../cuestionarios.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.css']
})
export class ListadoComponent implements OnInit {
  cuestionarios: any[] = [];

  constructor(private cuestionariosService: CuestionariosService, private router: Router) { }

  verCuestionario(id: string) {
    this.router.navigate(['/cuestionario', id]);
  }
  
  ngOnInit(): void {
    this.cuestionariosService.getCuestionarios().subscribe(cuestionarios => {
      this.cuestionarios = cuestionarios;
      console.log(this.cuestionarios); // Agregar este console.log()
    });
  }
}