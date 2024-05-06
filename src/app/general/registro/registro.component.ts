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
  // Propiedades adicionales para los campos del formulario
  institucion: string = '';
  nivel: string = '';
  grado: string = '';
  paralelo: string = '';

  constructor(private usuariosService: UsuariosService, private router: Router) { }

  registrarUsuario(email: string, nombre: string, apellido: string, clave: string, rol: string, institucion: string, grado?: string, paralelo?: string): void {
    this.errorMessage = '';

    this.usuariosService.registrarUsuario(email, clave, nombre, apellido, rol, institucion, grado, paralelo)
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

  // Función para manejar el cambio en el rol
  onChangeRol(): void {
    // Reiniciar los valores de las propiedades adicionales
    this.institucion = '';
    this.nivel = '';
    this.grado = '';
    this.paralelo = '';
  }

  // Función para manejar el cambio en el nivel educativo
  onChangeNivel(): void {
    // Reiniciar el valor de grado
    this.grado = '';
  }

  // Obtener las opciones de grado según el nivel educativo seleccionado
  getGrades(): string[] {
    if (this.nivel === 'educacionBasica') {
      return ['1ro', '2do', '3ro', '4to', '5to', '6to', '7mo', '8vo', '9no', '10mo'];
    } else if (this.nivel === 'bachillerato') {
      return ['1ro', '2do', '3ro'];
    } else {
      return [];
    }
  }

  // Definir las opciones de paralelo
  sections: string[] = ['A', 'B', 'C', 'D', 'E', 'F'];
}