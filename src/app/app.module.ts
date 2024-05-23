import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';  // Importa ambos módulos de formularios aquí
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './general/navbar/navbar.component';
import { FooterComponent } from './general/footer/footer.component';
import { ListadoComponent } from './cuestionarios/listado/listado.component';
import { CuestionarioComponent } from './cuestionarios/cuestionario/cuestionario.component';
import { PanelComponent } from './administrador/panel/panel.component';
import { IngresarCuestionariosComponent } from './administrador/ingresar-cuestionarios/ingresar-cuestionarios.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { ModificarCuestionarioComponent } from './administrador/modificar-cuestionario/modificar-cuestionario.component';
import { LoginComponent } from './general/login/login.component';
import { RegistroComponent } from './general/registro/registro.component';
import { PerfilComponent } from './usuarios/perfil/perfil.component';
import { IngresarTestpersonalidadComponent } from './administrador/ingresar-testpersonalidad/ingresar-testpersonalidad.component';
import { TestPersonalidadComponent } from './cuestionarios/test-personalidad/test-personalidad.component';
import { ModificarTestComponent } from './administrador/modificar-test/modificar-test.component';
import { HomeComponent } from './general/home/home.component';
import { ContactoComponent } from './general/contacto/contacto.component';

const firebaseConfig = {
  apiKey: "AIzaSyCWwK7ajx4Xbkn8ILriwSOsoJoYFP3Pa10",
  authDomain: "cuestionarios-24d7b.firebaseapp.com",
  databaseURL: "https://cuestionarios-24d7b-default-rtdb.firebaseio.com",
  projectId: "cuestionarios-24d7b",
  storageBucket: "cuestionarios-24d7b.appspot.com",
  messagingSenderId: "91160597427",
  appId: "1:91160597427:web:3da8443edb1504be21f1c6",
  measurementId: "G-P7NKJ9YTHY"
};

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    ListadoComponent,
    CuestionarioComponent,
    PanelComponent,
    IngresarCuestionariosComponent,
    ModificarCuestionarioComponent,
    LoginComponent,
    RegistroComponent,
    PerfilComponent,
    IngresarTestpersonalidadComponent,
    TestPersonalidadComponent,
    ModificarTestComponent,
    HomeComponent,
    ContactoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,  // Asegúrate de que ReactiveFormsModule esté aquí
    FormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }