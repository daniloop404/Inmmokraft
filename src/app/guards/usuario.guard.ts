import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuariosService } from '../sevicios/usuarios.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioGuard implements CanActivate {

  constructor(private usuariosService: UsuariosService, private router: Router) { }

  canActivate(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.usuariosService.getEstadoAutenticacion().subscribe(user => {
        if (user) {
          // Permitir acceso si el usuario está autenticado
          resolve(true);
        } else {
          // Redirigir al inicio de sesión si no está autenticado
          this.router.navigate(['/login']);
          resolve(false);
        }
      });
    });
  }
}