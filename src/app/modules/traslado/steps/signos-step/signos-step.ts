import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Form, FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-signos-step',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './signos-step.html',
  styleUrls: ['./signos-step.css']
})
export class SignosStep {
  @Input() signos!: FormArray<FormGroup>;
  @Input() agregar!: () => void;
  @Input() eliminar!: (index: number) => void;

  hours: number[] = Array.from({ length: 24 }, (_, i) => i + 1);
  minutes: number[] = [0, 15, 30, 45];

  get gruposSignos(): FormGroup[] {
    return this.signos.controls as FormGroup[];
  }

  getHourFromTime(timeString: string): number {
    if (!timeString) return 1;
    const [hour] = timeString.split(':');
    const hourNum = parseInt(hour, 10);
    return hourNum === 0 ? 1 : hourNum;
  }

  getMinuteFromTime(timeString: string): number {
    if (!timeString) return 0;
    const [, minute] = timeString.split(':');
    return parseInt(minute, 10) || 0;
  }

  formatNumber(num: number): string {
    return String(num).padStart(2, '0');
  }

  updateTime(formGroup: FormGroup, hour: number, minute: number): void {
    const timeString = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    formGroup.get('hora')?.setValue(timeString);
  }

  onHourChange(formGroup: FormGroup, hour: number): void {
    const currentValue = formGroup.get('hora')?.value || '01:00';
    const minute = this.getMinuteFromTime(currentValue);
    this.updateTime(formGroup, hour, minute);
  }

  onMinuteChange(formGroup: FormGroup, minute: number): void {
    const currentValue = formGroup.get('hora')?.value || '01:00';
    const hour = this.getHourFromTime(currentValue);
    this.updateTime(formGroup, hour, minute);  }
}
