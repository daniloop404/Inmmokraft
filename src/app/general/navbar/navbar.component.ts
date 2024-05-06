import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/sevicios/usuarios.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isUserLoggedIn: boolean = false;
  userName: string = ''; // Variable para almacenar el nombre del usuario

  constructor(private usuariosService: UsuariosService) { }

  ngOnInit(): void {
    this.usuariosService.getEstadoAutenticacion().subscribe(user => {
      this.isUserLoggedIn = !!user;
      if (user) {
        // Si el usuario está autenticado, obtener sus datos adicionales
        this.usuariosService.obtenerDatosUsuario(user.uid)
          .then((userData: any) => {
            this.userName = userData.nombre; // Asignar el nombre del usuario
          })
          .catch(error => {
            console.error('Error al obtener datos del usuario:', error);
          });
      }
    });
  }

  cerrarSesion(): void {
    this.usuariosService.cerrarSesion()
      .then(() => console.log('Sesión cerrada exitosamente'))
      .catch(error => console.error('Error al cerrar sesión:', error));
  }
}