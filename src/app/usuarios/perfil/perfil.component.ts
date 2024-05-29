import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { ResultadosService } from 'src/app/servicios/resultados.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario: any = {}; // Objeto para almacenar los datos del usuario
  resultados: any[] = []; // Arreglo para almacenar los resultados del test

  constructor(
    private usuariosService: UsuariosService,
    private resultadosService: ResultadosService // Agregar el servicio ResultadosService
  ) { }

  ngOnInit(): void {
    this.obtenerDatosUsuario();
  }

  obtenerDatosUsuario() {
    this.usuariosService.getEstadoAutenticacion().subscribe(authState => {
      if (authState) {
        this.usuariosService.obtenerDatosUsuario(authState.uid)
          .then((usuarioData: any) => {
            this.usuario = usuarioData;
            this.obtenerResultadosUsuario(authState.uid); // Obtener los resultados del test
          })
          .catch(error => {
            console.error('Error al obtener los datos del usuario:', error);
          });
      }
    });
  }

  obtenerResultadosUsuario(uid: string) {
    this.resultadosService.obtenerDatosUsuario(uid).subscribe(data => {
      const userKey = Object.keys(data).find(key => data[key].uid === uid);
      if (userKey) {
        // Convertir el objeto 'resultadosPersonalidad' en un arreglo
        this.resultados = Object.values(data[userKey].resultadosPersonalidad || {}); 
      }
    });
  }
}