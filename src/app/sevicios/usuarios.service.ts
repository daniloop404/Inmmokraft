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
      // Hacer una petición HTTP para obtener los datos del usuario por su UID
      this.http.get(`${this.API_USUARIOS}.json`).toPromise()
        .then((data: any) => {
          // Iterar sobre los usuarios en la base de datos
          const usuarios = data ? Object.values(data) : [];
          const usuarioEncontrado = usuarios.find((usuario: any) => usuario.uid === uid);
          if (usuarioEncontrado) {
            resolve(usuarioEncontrado); // Devolver los datos del usuario encontrado
          } else {
            reject(new Error('Usuario no encontrado')); // Si no se encuentra el usuario, rechazar la promesa
          }
        })
        .catch(error => {
          reject(error); // Manejar errores de la petición HTTP
        });
    });
  }
}