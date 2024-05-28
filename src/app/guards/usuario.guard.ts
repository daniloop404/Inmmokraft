import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuariosService } from '../servicios/usuarios.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioGuard implements CanActivate {

  constructor(private usuariosService: UsuariosService, private router: Router) { }

  canActivate(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.usuariosService.getEstadoAutenticacion().subscribe(user => {
        if (user) {
          // Obtiene los datos del usuario
          this.usuariosService.obtenerDatosUsuario(user.uid)
            .then((userData: any) => {
              // Permite el acceso a cualquier usuario, incluyendo administradores
              resolve(true); 
            })
            .catch(error => {
              console.error('Error al obtener datos del usuario:', error);
              this.router.navigate(['/']);
              resolve(false);
            });
        } else {
          // Redirigir al inicio de sesión si no está autenticado
          this.router.navigate(['/login']);
          resolve(false);
        }
      });
    });
  }
}