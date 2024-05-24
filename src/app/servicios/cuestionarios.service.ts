import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CuestionariosService {
  private API_CUESTIONARIOS = 'https://cuestionarios-24d7b-default-rtdb.firebaseio.com/cuestionarios';

  constructor(private http: HttpClient, private storage: AngularFireStorage) { }

  getCuestionarios(): Observable<any[]> {
    const url = `${this.API_CUESTIONARIOS}.json`;
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

  postCuestionario(nuevoCuestionario: any): Observable<any> {
    const url = `${this.API_CUESTIONARIOS}.json`;
    console.log('Nuevo cuestionario:', nuevoCuestionario);
    return this.http.post(url, nuevoCuestionario);
  }

  getCuestionarioById(id: string): Observable<any> {
    const url = `${this.API_CUESTIONARIOS}/${id}.json`;
    return this.http.get<any>(url);
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

  eliminarCuestionario(id: string): Observable<void> {
    const url = `${this.API_CUESTIONARIOS}/${id}.json`;
    return this.http.delete<void>(url);
  }
  updateCuestionario(id: string, updatedCuestionario: any): Observable<any> {
    const url = `${this.API_CUESTIONARIOS}/${id}.json`;
    return this.http.put(url, updatedCuestionario);
  }
  
}