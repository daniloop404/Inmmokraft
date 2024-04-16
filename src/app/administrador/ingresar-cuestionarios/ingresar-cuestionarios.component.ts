import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CuestionariosService } from 'src/app/cuestionarios/cuestionarios.service';
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

  constructor(private formBuilder: FormBuilder, private cuestionariosService: CuestionariosService) {
    this.cuestionarioForm = this.formBuilder.group({
      nombrecuestionario: ['', Validators.required],
      category: ['', Validators.required],
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
    if (this.cuestionarioForm.valid) {
      const confirmacion = confirm('¿Está seguro de que desea guardar el cuestionario?');
      if (confirmacion) {
        const nuevoCuestionario = { ...this.cuestionarioForm.value };

        // Convertir observables de imageUrl a URL directa
        for (let i = 0; i < nuevoCuestionario.questions.length; i++) {
          const question = nuevoCuestionario.questions[i];
          if (question.imageFile) {
            try {
              const imageUrl = await this.cuestionariosService.uploadImage(question.imageFile);
              question.imageUrl = imageUrl; // Asigna la URL directamente // No necesitas toPromise() aquí
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
            }, 3000);
          },
          (error) => {
            console.error('Error al agregar cuestionario:', error);
          }
        );
      } else {
        console.log('El cuestionario no fue guardado.');
      }
    } else {
      console.error('El formulario no es válido');
    }
  }

  onImageUpload(event: any, questionIndex: number) {
    const file = event.target.files[0];
    const question = this.questions.at(questionIndex);
    question.get('imageFile')?.setValue(file);

    // Mostrar previsualización de la imagen
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreviews[questionIndex] = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  // Función TrackBy
  customTrackBy(index: number, obj: any): any {
    return index;
  }
}