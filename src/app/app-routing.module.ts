import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { ListadoComponent } from './cuestionarios/listado/listado.component';
import { CuestionarioComponent } from './cuestionarios/cuestionario/cuestionario.component';
import { IngresarCuestionariosComponent } from './administrador/ingresar-cuestionarios/ingresar-cuestionarios.component';
import { PanelComponent } from './administrador/panel/panel.component';
import { ModificarCuestionarioComponent } from './administrador/modificar-cuestionario/modificar-cuestionario.component';
import { RegistroComponent } from './general/registro/registro.component';
import { LoginComponent } from './general/login/login.component';
import { PerfilComponent } from './usuarios/perfil/perfil.component';
import { ProfesorGuard } from './guards/profesor.guard';
import { IngresarTestpersonalidadComponent } from './administrador/ingresar-testpersonalidad/ingresar-testpersonalidad.component';
import { TestPersonalidadComponent } from './cuestionarios/test-personalidad/test-personalidad.component';
import { ModificarTestComponent } from './administrador/modificar-test/modificar-test.component';
import { HomeComponent } from './general/home/home.component';
import { ContactoComponent } from './general/contacto/contacto.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'cuestionarios', component: ListadoComponent},
  { path: 'cuestionario/:id', component: CuestionarioComponent }, // Agregamos un parámetro de ruta dinámico ":id"
  { path: 'modificar-cuestionario/:id', component:ModificarCuestionarioComponent},
  { path: 'ingresar-cuestionarios', component: IngresarCuestionariosComponent},
  { path: 'registro', component:RegistroComponent},
  { path: 'login', component:LoginComponent},
  { path: 'administrador', component: PanelComponent},
  { path: 'perfil', component: PerfilComponent},
  { path: 'ingreso-test', component:IngresarTestpersonalidadComponent},
  { path: 'test-personalidad/:id', component:TestPersonalidadComponent},
  { path: 'test-personalidad-modificar/:id', component:ModificarTestComponent},
  { path: 'contacto', component: ContactoComponent},

  

];

@NgModule({
  imports: [RouterModule.forRoot(routes), FormsModule], // Add FormsModule here
  exports: [RouterModule]
})
export class AppRoutingModule { }