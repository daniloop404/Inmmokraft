import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuariosService } from '../servicios/usuarios.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private usuariosService: UsuariosService, private router: Router) { }

  canActivate(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.usuariosService.getEstadoAutenticacion().subscribe(user => {
        if (user) {
          this.usuariosService.obtenerDatosUsuario(user.uid)
            .then((userData: any) => {
              if (userData.rol && userData.rol.toLowerCase() === 'admin') {
                resolve(true);
              } else {
                this.router.navigate(['/']);
                resolve(false);
              }
            })
            .catch(error => {
              console.error('Error al obtener datos del usuario:', error);
              this.router.navigate(['/']);
              resolve(false);
            });
        } else {
          this.router.navigate(['/login']);
          resolve(false);
        }
      });
    });
  }
}