import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ResultadosService {
  private API_USUARIOS = "https://cuestionarios-24d7b-default-rtdb.firebaseio.com/usuarios";

  constructor(private http: HttpClient) {}

  obtenerDatosUsuario(uid: string): Observable<any> {
    const url = `${this.API_USUARIOS}.json`;
    return this.http.get(url);
  }

  guardarResultadosCuestionario(uid: string, cuestionarioId: string, totalQuestions: number, totalScore: number): Observable<any> {
    return this.obtenerDatosUsuario(uid).pipe(
      switchMap((data: any) => {
        const userKey = Object.keys(data).find(key => data[key].uid === uid);
        if (userKey) {
          const resultadosUrl = `${this.API_USUARIOS}/${userKey}/resultados.json`;
          const nuevoResultado = { cuestionarioId, totalQuestions, totalScore };
          return this.http.post(resultadosUrl, nuevoResultado);
        } else {
          throw new Error('Usuario no encontrado');
        }
      })
    );
  }

  guardarResultadosTestPersonalidad(uid: string, testId: string, score: number, resultado: string): Observable<any> {
    return this.obtenerDatosUsuario(uid).pipe(
      switchMap((data: any) => {
        const userKey = Object.keys(data).find(key => data[key].uid === uid);
        if (userKey) {
          const resultadosUrl = `${this.API_USUARIOS}/${userKey}/resultadosPersonalidad.json`;
          const nuevoResultado = { testId, score, resultado };
          return this.http.post(resultadosUrl, nuevoResultado);
        } else {
          throw new Error('Usuario no encontrado');
        }
      })
    );
  }
}