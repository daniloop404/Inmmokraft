import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isUserLoggedIn: boolean = false;
  userName: string = '';
  rol: string = ''; // Agrega esta línea

  constructor(private usuariosService: UsuariosService, private router: Router) { }

  ngOnInit(): void {
    this.usuariosService.getEstadoAutenticacion().subscribe(user => {
      this.isUserLoggedIn = !!user;
      if (user) {
        this.usuariosService.obtenerDatosUsuario(user.uid)
          .then((userData: any) => {
            this.userName = userData.nombre;
            this.rol = userData.rol; // Asigna el rol del usuario
          })
          .catch(error => {
            console.error('Error al obtener datos del usuario:', error);
          });
      } else {
        this.userName = '';
        this.rol = ''; // Reinicia el rol cuando el usuario no está autenticado
      }
    });
  }

  cerrarSesion(): void {
    this.usuariosService.cerrarSesion()
      .then(() => {
        console.log('Sesión cerrada exitosamente');
        this.router.navigate(['/']);
      })
      .catch(error => console.error('Error al cerrar sesión:', error));
  }
}