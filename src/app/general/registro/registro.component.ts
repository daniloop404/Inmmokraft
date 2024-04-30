// registro.component.ts
import { Component } from '@angular/core';
import { UsuariosService } from 'src/app/sevicios/usuarios.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  errorMessage: string = '';
  registroExitoso: boolean = false;

  constructor(private usuariosService: UsuariosService, private router: Router) { }

  registrarUsuario(email: string, nombre: string, apellido: string, clave: string): void {
    this.errorMessage = '';

    this.usuariosService.registrarUsuario(email, clave, nombre, apellido)
      .then(() => {
        console.log('Usuario registrado exitosamente.');
        this.registroExitoso = true;

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      })
      .catch(error => {
        console.error('Error al registrar el usuario:', error);
        if (error.code === 'auth/weak-password') {
          this.errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
        } else if (error.code === 'auth/invalid-email') {
          this.errorMessage = 'El correo electrónico proporcionado no es válido.';
        } else if (error.code === 'auth/email-already-in-use') {
          this.errorMessage = 'El correo electrónico ya está siendo utilizado por otra cuenta.';
        } else {
          this.errorMessage = 'Error al registrar el usuario. Por favor, inténtalo de nuevo más tarde.';
        }
      });
  }
}