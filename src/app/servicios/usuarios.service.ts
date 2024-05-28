import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private afAuth: AngularFireAuth, private http: HttpClient) { }

  private API_USUARIOS = "https://tests-de-personalidad-default-rtdb.firebaseio.com/usuarios";

  registrarUsuario(email: string, password: string, nombre: string, apellido: string, rol: string, institucion: string, grado?: string, paralelo?: string): Promise<any> {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Guardar datos adicionales en Firebase Database
        const nuevoUsuario = {
          uid: userCredential.user?.uid,
          email: email,
          nombre: nombre,
          apellido: apellido,
          rol: rol,
          institucion: institucion,
          grado: grado,
          paralelo: paralelo
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

  obtenerDatosUsuario(uid: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.API_USUARIOS}.json`).toPromise()
        .then((data: any) => {
          const usuarios = data ? Object.values(data) : [];
          const usuarioEncontrado = usuarios.find((usuario: any) => usuario.uid === uid);
          if (usuarioEncontrado) {
            resolve(usuarioEncontrado);
          } else {
            reject(new Error('Usuario no encontrado'));
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  getUsuarioById(userId: string): Observable<any> {
    const url = `${this.API_USUARIOS}/${userId}.json`;
    return this.http.get<any>(url).pipe(
      map(data => ({ id: userId, ...data }))
    );
  }
}