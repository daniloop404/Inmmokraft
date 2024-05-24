import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CuestionariosService } from 'src/app/servicios/cuestionarios.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-ingresar-cuestionarios',
  templateUrl: './ingresar-cuestionarios.component.html',
  styleUrls: ['./ingresar-cuestionarios.component.css']
})
export class IngresarCuestionariosComponent {
  cuestionarioForm: FormGroup;
  cuestionarioGuardado: boolean = false;
  imagePreviews: string[] = [];
  portadaPreview: string | null = null;

  constructor(private formBuilder: FormBuilder, private cuestionariosService: CuestionariosService) {
    this.cuestionarioForm = this.formBuilder.group({
      nombrecuestionario: ['', Validators.required],
      category: ['', Validators.required],
      portadaFile: [null], // Agregar campo para almacenar el archivo de imagen de portada
      questions: this.formBuilder.array([])
    });

    this.addQuestion();
  }

  get questions() {
    return this.cuestionarioForm.get('questions') as FormArray;
  }

  addQuestion() {
    const question = this.formBuilder.group({
      id: [this.questions.length + 1],
      text: ['', Validators.required],
      options: this.formBuilder.array([
        this.createOption(),
        this.createOption()
      ]),
      selectedAnswer: [null],
      imageUrl: [''],
      imageFile: [null] // Agregar campo para almacenar el archivo de imagen
    });

    this.questions.push(question);
  }

  createOption() {
    return this.formBuilder.group({
      text: ['', Validators.required],
      correct: [false]
    });
  }

  addOption(questionIndex: number) {
    const options = this.questions.at(questionIndex).get('options') as FormArray;
    options.push(this.createOption());
  }

  deleteOption(questionIndex: number) {
    const options = this.questions.at(questionIndex).get('options') as FormArray;
    options.removeAt(options.length - 1);
  }

  deleteQuestion(index: number) {
    const imageUrl = this.questions.at(index).get('imageUrl').value;
    if (imageUrl) {
      this.cuestionariosService.deleteImageFromStorage(imageUrl).then(() => {
        console.log('Imagen eliminada de la base de datos.');
      }).catch(error => {
        console.error('Error al eliminar la imagen:', error);
      });
    }
    this.questions.removeAt(index);
    this.imagePreviews.splice(index, 1);
  }

  onOptionChange(questionIndex: number, optionIndex: number) {
    const question = this.questions.at(questionIndex);
    const options = question.get('options') as FormArray;

    options.controls.forEach((option, index) => {
      if (index !== optionIndex) {
        option.get('correct')?.setValue(false);
      }
    });
  }

  canDeleteOption(questionIndex: number): boolean {
    const options = this.questions.at(questionIndex).get('options') as FormArray;
    return options.length > 2;
  }

  async onSubmit() {
    if (!this.isFormValid()) {
      console.error('Por favor complete todos los campos obligatorios.');
      return;
    }

    const confirmacion = confirm('¿Está seguro de que desea guardar el cuestionario?');
    if (confirmacion) {
      const nuevoCuestionario = { ...this.cuestionarioForm.value };

      const preguntasValidas = nuevoCuestionario.questions.every((question: any) => {
        return question.options.some((option: any) => option.correct);
      });

      if (!preguntasValidas) {
        alert('Cada pregunta debe tener al menos una opción marcada como correcta.');
        return;
      }

      // Subir la imagen de portada si existe
      if (nuevoCuestionario.portadaFile) {
        try {
          const portadaUrl = await this.cuestionariosService.uploadImage(nuevoCuestionario.portadaFile);
          nuevoCuestionario.portadaUrl = portadaUrl; // Asigna la URL directamente
          nuevoCuestionario.portadaFile = null; // Eliminar el archivo de imagen para evitar la serialización circular
        } catch (error) {
          console.error('Error al cargar la imagen de portada:', error);
        }
      }

      for (let i = 0; i < nuevoCuestionario.questions.length; i++) {
        const question = nuevoCuestionario.questions[i];
        if (question.imageFile) {
          try {
            const imageUrl = await this.cuestionariosService.uploadImage(question.imageFile);
            question.imageUrl = imageUrl; // Asigna la URL directamente
            question.imageFile = null; // Eliminar el archivo de imagen para evitar la serialización circular
          } catch (error) {
            console.error('Error al cargar la imagen:', error);
          }
        }
      }

      this.cuestionariosService.postCuestionario(nuevoCuestionario).subscribe(
        (response) => {
          console.log('Cuestionario agregado exitosamente:', response);
          this.cuestionarioGuardado = true;
          setTimeout(() => {
            this.cuestionarioForm.reset();
            this.addQuestion();
            this.cuestionarioGuardado = false;
            this.imagePreviews = [];
            this.portadaPreview = null;
          }, 3000);
        },
        (error) => {
          console.error('Error al agregar cuestionario:', error);
        }
      );
    } else {
      console.log('El cuestionario no fue guardado.');
    }
  }

  onPortadaUpload(event: any) {
    const file = event.target.files[0];
    this.cuestionarioForm.get('portadaFile')?.setValue(file);

    const reader = new FileReader();
    reader.onload = () => {
      this.portadaPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onImageUpload(event: any, questionIndex: number) {
    const file = event.target.files[0];
    const question = this.questions.at(questionIndex);
    question.get('imageFile')?.setValue(file);

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreviews[questionIndex] = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  customTrackBy(index: number, obj: any): any {
    return index;
  }

  isFormValid(): boolean {
    if (this.cuestionarioForm.invalid) {
      return false;
    }

    const controls = this.cuestionarioForm.controls;
    for (const field in controls) {
      if (controls[field].invalid) {
        return false;
      }
    }

    const questions = this.questions.controls;
    for (const question of questions) {
      if (question.invalid) {
        return false;
      }
    }

    return true;
  }
}