import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuariosService } from '../servicios/usuarios.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

  constructor(private usuariosService: UsuariosService, private router: Router) { }

  canActivate(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.usuariosService.getEstadoAutenticacion().subscribe(user => {
        if (!user) {
          // Si el usuario no está autenticado, permitir el acceso
          resolve(true);
        } else {
          // Si el usuario está autenticado, redirigir al inicio
          this.router.navigate(['/']);
          resolve(false);
        }
      });
    });
  }
}