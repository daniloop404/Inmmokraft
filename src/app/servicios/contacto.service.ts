import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {
  private API_CONTACTOS = 'https://tests-de-personalidad-default-rtdb.firebaseio.com/contactos';

  constructor(private http: HttpClient) { }

  postContacto(nuevoContacto: any): Observable<any> {
    const url = `${this.API_CONTACTOS}.json`;
    return this.http.post(url, nuevoContacto);
  }

  getContactos(): Observable<any[]> {
    const url = `${this.API_CONTACTOS}.json`;
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

  eliminarContacto(id: string): Observable<void> {
    const url = `${this.API_CONTACTOS}/${id}.json`;
    return this.http.delete<void>(url);
  }
}