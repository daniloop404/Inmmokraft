import { Component } from '@angular/core';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { Router } from '@angular/router'; // Importa el módulo Router

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  errorMessage: string = ''; // Variable para almacenar el mensaje de error

  constructor(private usuariosService: UsuariosService, private router: Router) { }

  iniciarSesion(email: string, clave: string): void {
    this.errorMessage = ''; // Reinicia el mensaje de error antes de intentar iniciar sesión

    this.usuariosService.iniciarSesion(email, clave)
      .then(() => {
        // Éxito al iniciar sesión
        console.log('Inicio de sesión exitoso.');
        // Redirige al usuario a la página de inicio después del inicio de sesión
        this.router.navigate(['/']); // Cambia '/' por la ruta deseada después del inicio de sesión
      })
      .catch(error => {
        // Error al iniciar sesión
        console.error('Error al iniciar sesión:', error);

        // Extrae y muestra el mensaje de error específico de Firebase
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
          this.errorMessage = 'El correo electrónico o la contraseña son incorrectos.';
        } else if (error.code === 'auth/invalid-email') {
          this.errorMessage = 'El correo electrónico proporcionado no es válido.';
        } else if (error.code === 'auth/missing-password') {
          this.errorMessage = 'Debes proporcionar una contraseña.';
        } else if (error.code === 'auth/invalid-credential') {
          this.errorMessage = 'Usuario o contraseña incorrectos. Por favor, verifica tus credenciales e inténtalo de nuevo.';
        } else {
          this.errorMessage = 'Error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.';
        }
      });
  }
}