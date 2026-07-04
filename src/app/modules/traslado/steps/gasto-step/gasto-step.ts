import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-gasto-step',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './gasto-step.html',
  styleUrls: ['./gasto-step.css']
})
export class GastoStep {
  @Input() gastos!: FormArray<FormGroup>;
  @Input() agregar!: () => void;
  @Input() eliminar!: (index: number) => void;

  get filas() {
    return this.gastos?.controls ?? [];
  }
}
