// usuarios.service.ts
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private afAuth: AngularFireAuth, private http: HttpClient) { }

  private API_USUARIOS = "https://cuestionarios-24d7b-default-rtdb.firebaseio.com/usuarios";

  registrarUsuario(email: string, password: string, nombre: string, apellido: string): Promise<any> {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Guardar datos adicionales en Firebase Database
        const nuevoUsuario = {
          uid: userCredential.user?.uid,
          email: email,
          nombre: nombre,
          apellido: apellido
        };
        return this.http.post(`${this.API_USUARIOS}.json`, nuevoUsuario).toPromise();
      });
  }

  iniciarSesion(email: string, password: string): Promise<any> {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  cerrarSesion(): Promise<void> {
    return this.afAuth.signOut();
  }

  getEstadoAutenticacion(): Observable<any> {
    return this.afAuth.authState;
  }
}