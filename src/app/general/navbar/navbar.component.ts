import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/sevicios/usuarios.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isUserLoggedIn: boolean = false; // Variable para almacenar el estado de autenticación del usuario

  constructor(private usuariosService: UsuariosService) { }

  ngOnInit(): void {
    // Suscríbete al estado de autenticación para actualizar isUserLoggedIn cuando cambie
    this.usuariosService.getEstadoAutenticacion().subscribe(user => {
      this.isUserLoggedIn = !!user; // Si hay un usuario autenticado, isUserLoggedIn será true
    });
  }

  // Método para cerrar sesión
  cerrarSesion(): void {
    this.usuariosService.cerrarSesion()
      .then(() => console.log('Sesión cerrada exitosamente'))
      .catch(error => console.error('Error al cerrar sesión:', error));
  }
}