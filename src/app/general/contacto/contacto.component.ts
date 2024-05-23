import { Component } from '@angular/core';
import { ContactoService } from 'src/app/servicios/contacto.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent {
  contactoForm: FormGroup;
  cuestionarioGuardado = false;

  constructor(private fb: FormBuilder, private contactoService: ContactoService, private router: Router) {
    this.contactoForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.contactoForm.valid) {
      if (confirm('¿Está seguro de que desea enviar el mensaje?')) {
        this.contactoService.postContacto(this.contactoForm.value).subscribe(response => {
          console.log('Contacto guardado', response);
          this.contactoForm.reset();
          this.cuestionarioGuardado = true;
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 3000); // Redirigir después de 3 segundos
        }, error => {
          console.error('Error al guardar contacto', error);
        });
      }
    }
  }

  // Método para mostrar mensajes de error
  get email() {
    return this.contactoForm.get('email');
  }

  get message() {
    return this.contactoForm.get('message');
  }
}