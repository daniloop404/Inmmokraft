import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CuestionariosService {
  private API_CUESTIONARIOS = 'https://cuestionarios-24d7b-default-rtdb.firebaseio.com/cuestionarios';

  constructor(private http: HttpClient) { }

  postCuestionario(nuevoCuestionario: any): Observable<any> {
    const url = `${this.API_CUESTIONARIOS}.json`;
    return this.http.post(url, nuevoCuestionario);
  }
}