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
import { IngresarCuestionariosComponent } from './administrador/ingresar-cuestionarios/ingresar-cuestionarios.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';

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
    IngresarCuestionariosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireStorageModule,
    AngularFireDatabaseModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }