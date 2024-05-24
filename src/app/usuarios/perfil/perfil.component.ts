import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario: any = {}; // Objeto para almacenar los datos del usuario

  constructor(private usuariosService: UsuariosService) { }

  ngOnInit(): void {
    this.obtenerDatosUsuario();
  }

  obtenerDatosUsuario() {
    // Obtener el UID del usuario autenticado
    this.usuariosService.getEstadoAutenticacion().subscribe(authState => {
      if (authState) {
        // Si hay un usuario autenticado, obtener sus datos
        this.usuariosService.obtenerDatosUsuario(authState.uid)
          .then((usuarioData: any) => {
            this.usuario = usuarioData; // Almacenar los datos del usuario
          })
          .catch(error => {
            console.error('Error al obtener los datos del usuario:', error);
          });
      }
    });
  }
}