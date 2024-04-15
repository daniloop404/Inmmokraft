import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './general/navbar/navbar.component';
import { FooterComponent } from './general/footer/footer.component';
import { ListadoComponent } from './cuestionarios/listado/listado.component';
import { CuestionarioComponent } from './cuestionarios/cuestionario/cuestionario.component';
import { PanelComponent } from './administrador/panel/panel.component';
import { FormsModule } from '@angular/forms';
import { IngresarCuestionariosComponent } from './administrador/ingresar-cuestionarios/ingresar-cuestionarios.component'; // Import FormsModule


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    ListadoComponent,
    CuestionarioComponent,
    PanelComponent,
    IngresarCuestionariosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
