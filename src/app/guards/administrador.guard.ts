import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuariosService } from '../sevicios/usuarios.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private usuariosService: UsuariosService, private router: Router) { }

  canActivate(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.usuariosService.getEstadoAutenticacion().subscribe(user => {
        if (user) {
          // Si el usuario está autenticado, obtener sus datos adicionales
          this.usuariosService.obtenerDatosUsuario(user.uid)
            .then((userData: any) => {
              if (userData.rol && userData.rol.toLowerCase() === 'admin') {
                // Permitir acceso a rutas solo para administradores
                resolve(true);
              } else {
                // Redirigir a la página de inicio o mostrar un mensaje de error
                this.router.navigate(['/']);
                resolve(false);
              }
            })
            .catch(error => {
              console.error('Error al obtener datos del usuario:', error);
              // Redirigir a la página de inicio o mostrar un mensaje de error
              this.router.navigate(['/']);
              resolve(false);
            });
        } else {
          // Si el usuario no está autenticado, redirigir al inicio de sesión
          this.router.navigate(['/login']);
          resolve(false);
        }
      });
    });
  }
}