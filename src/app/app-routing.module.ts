import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { ListadoComponent } from './cuestionarios/listado/listado.component';
import { CuestionarioComponent } from './cuestionarios/cuestionario/cuestionario.component';
import { IngresarCuestionariosComponent } from './administrador/ingresar-cuestionarios/ingresar-cuestionarios.component';
import { PanelComponent } from './administrador/panel/panel.component';

const routes: Routes = [
  { path: 'cuestionarios', component: ListadoComponent },
  { path: 'cuestionario/:id', component: CuestionarioComponent }, // Agregamos un parámetro de ruta dinámico ":id"
  { path: 'ingresar-cuestionarios', component: IngresarCuestionariosComponent},
  { path: 'administrador', component: PanelComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes), FormsModule], // Add FormsModule here
  exports: [RouterModule]
})
export class AppRoutingModule { }