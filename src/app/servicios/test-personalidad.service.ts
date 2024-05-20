import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TestPersonalidadService {
  private API_TEST_PERSONALIDAD = 'https://cuestionarios-24d7b-default-rtdb.firebaseio.com/tests-personalidad';

  constructor(private http: HttpClient, private storage: AngularFireStorage) { }

  postTestPersonalidad(nuevoTest: any): Observable<any> {
    const url = `${this.API_TEST_PERSONALIDAD}.json`;
    console.log('Nuevo Test de Personalidad:', nuevoTest);
    return this.http.post(url, nuevoTest);
  }

  getTestsPersonalidad(): Observable<any[]> {
    const url = `${this.API_TEST_PERSONALIDAD}.json`;
    return this.http.get<any[]>(url).pipe(
      map(data => {
        if (data) {
          return Object.keys(data).map(key => ({ id: key, ...data[key] }));
        } else {
          return [];
        }
      })
    );
  }

  getTestPersonalidadById(id: string): Observable<any> {
    const url = `${this.API_TEST_PERSONALIDAD}/${id}.json`;
    return this.http.get<any>(url).pipe(
      map(testPersonalidad => {
        if (testPersonalidad) {
          // Asignar la propiedad imagenPregunta a cada pregunta
          testPersonalidad.preguntas.forEach(pregunta => {
            pregunta.opciones = ['En desacuerdo totalmente', 'En desacuerdo', 'Ni en desacuerdo ni en acuerdo', 'En acuerdo', 'En total acuerdo'];
            if (pregunta.imagenPregunta) {
              pregunta.imagenPregunta = pregunta.imagenPregunta;
            } else {
              pregunta.imagenPregunta = ''; // Asignar una cadena vacía si no hay URL de imagen
            }
          });
          return testPersonalidad;
        } else {
          return null;
        }
      })
    );
  }

  eliminarTestPersonalidad(id: string): Observable<void> {
    const url = `${this.API_TEST_PERSONALIDAD}/${id}.json`;
    return this.http.delete<void>(url);
  }

  updateTestPersonalidad(id: string, updatedTest: any): Observable<any> {
    const url = `${this.API_TEST_PERSONALIDAD}/${id}.json`;
    return this.http.put(url, updatedTest);
  }

  uploadImage(image: File): Promise<string> {
    const filePath = `images/${image.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, image);
  
    return new Promise((resolve, reject) => {
      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            resolve(url); // Resuelve la URL de la imagen una vez que esté disponible
          });
        })
      ).subscribe();
    });
  }

  deleteImageFromStorage(imageUrl: string): Promise<void> {
    const storageRef = this.storage.refFromURL(imageUrl);
    return storageRef.delete().toPromise();
  }
}