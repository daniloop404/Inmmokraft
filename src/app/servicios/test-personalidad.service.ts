// test-personalidad.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs';

@Injectable({
 providedIn: 'root'
})
export class TestPersonalidadService {
 private API_TEST_PERSONALIDAD = 'https://cuestionarios-24d7b-default-rtdb.firebaseio.com/tests-personalidad';

 constructor(private http: HttpClient) { }

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
   return this.http.get<any>(url);
 }

 eliminarTestPersonalidad(id: string): Observable<void> {
   const url = `${this.API_TEST_PERSONALIDAD}/${id}.json`;
   return this.http.delete<void>(url);
 }

 updateTestPersonalidad(id: string, updatedTest: any): Observable<any> {
   const url = `${this.API_TEST_PERSONALIDAD}/${id}.json`;
   return this.http.put(url, updatedTest);
 }
}