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
  institucion: string = '';
  nivel: string = '';
  grado: string = '';
  paralelo: string = '';
  esProfesor: boolean = false;
  esEstudiante: boolean = false;

  constructor(private usuariosService: UsuariosService, private router: Router) { }

  registrarUsuario(email: string, nombre: string, apellido: string, clave: string, institucion: string, grado?: string, paralelo?: string): void {
    this.errorMessage = '';

    const rol = 'admin';  // Ajusta esto según sea necesario.

    this.usuariosService.registrarUsuario(email, clave, nombre, apellido, rol, institucion, grado, paralelo)
      .then(() => {
        console.log('Usuario registrado exitosamente.');
        this.registroExitoso = true;

        // Asegúrate de cerrar sesión y redirigir al login
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

  toggleProfesor(): void {
    this.esProfesor = !this.esProfesor;
    this.esEstudiante = false;
    if (!this.esProfesor) {
      this.institucion = '';
    }
  }

  toggleEstudiante(): void {
    this.esEstudiante = !this.esEstudiante;
    this.esProfesor = false;
    if (!this.esEstudiante) {
      this.institucion = '';
      this.nivel = '';
      this.grado = '';
      this.paralelo = '';
    }
  }

  onChangeNivel(): void {
    this.grado = '';
  }

  getGrades(): string[] {
    if (this.nivel === 'educacionBasica') {
      return ['1ro', '2do', '3ro', '4to', '5to', '6to', '7mo', '8vo', '9no', '10mo'];
    } else if (this.nivel === 'bachillerato') {
      return ['1ro', '2do', '3ro'];
    } else {
      return [];
    }
  }

  sections: string[] = ['A', 'B', 'C', 'D', 'E', 'F'];
}