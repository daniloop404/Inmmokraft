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
import { IngresarTestpersonalidadComponent } from './administrador/ingresar-testpersonalidad/ingresar-testpersonalidad.component';
import { TestPersonalidadComponent } from './cuestionarios/test-personalidad/test-personalidad.component';
import { ModificarTestComponent } from './administrador/modificar-test/modificar-test.component';
import { HomeComponent } from './general/home/home.component';
import { ContactoComponent } from './general/contacto/contacto.component';
import { AdminGuard } from './guards/administrador.guard';
import { UsuarioGuard } from './guards/usuario.guard';
import { NoAuthGuard } from './guards/noauth.guard';
import { TerminosComponent } from './terminos/terminos.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'cuestionarios', component: ListadoComponent, canActivate: [UsuarioGuard] },
  { path: 'cuestionario/:id', component: CuestionarioComponent },
  { path: 'modificar-cuestionario/:id', component: ModificarCuestionarioComponent, canActivate: [AdminGuard] },
  { path: 'ingresar-cuestionarios', component: IngresarCuestionariosComponent, canActivate: [AdminGuard] },
  { path: 'registro', component: RegistroComponent, canActivate: [NoAuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
  { path: 'administrador', component: PanelComponent, canActivate: [AdminGuard] },
  { path: 'perfil', component: PerfilComponent, canActivate: [UsuarioGuard] },
  { path: 'ingreso-test', component: IngresarTestpersonalidadComponent, canActivate: [AdminGuard] },
  { path: 'test-personalidad/:id', component: TestPersonalidadComponent },
  { path: 'test-personalidad-modificar/:id', component: ModificarTestComponent, canActivate: [AdminGuard] },
  { path: 'contacto', component: ContactoComponent },
  { path: 'terminos', component: TerminosComponent},

  

];

@NgModule({
  imports: [RouterModule.forRoot(routes), FormsModule], // Add FormsModule here
  exports: [RouterModule]
})
export class AppRoutingModule { }