import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CuestionariosService } from 'src/app/cuestionarios/cuestionarios.service';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {
  cuestionarios: any[] = [];

  constructor(private router: Router, private cuestionariosService: CuestionariosService) { }

  ngOnInit(): void {
    this.actualizarCuestionarios();
  }

  agregarCuestionario() {
    this.router.navigate(['/ingresar-cuestionarios']);
  }

  eliminarCuestionario(id: string) {
    // Lógica para eliminar el cuestionario con el ID proporcionado
    this.cuestionariosService.eliminarCuestionario(id).subscribe(() => {
      // Actualizar la lista de cuestionarios después de eliminar
      this.actualizarCuestionarios();
    });
  }

  modificarCuestionario(id: string) {
    // Redirigir a la página para modificar el cuestionario con el ID proporcionado
    this.router.navigate(['/modificar-cuestionario', id]);
  }

  private actualizarCuestionarios() {
    // Actualizar la lista de cuestionarios cargándola nuevamente desde la base de datos
    this.cuestionariosService.getCuestionarios().subscribe(cuestionarios => {
      this.cuestionarios = cuestionarios;
    });
  }
}