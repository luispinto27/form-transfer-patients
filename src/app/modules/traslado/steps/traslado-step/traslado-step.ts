import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-traslado-step',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './traslado-step.html',
  styleUrls: ['./traslado-step.css']
})
export class TrasladoStep implements OnInit {
  @Input() group!: FormGroup;
  @Input() isSearching = false;
  @Input() searchLocked = false;
  @Input() searchError: string | null = null;
  @Output() buscarAutorizacion = new EventEmitter<string>();
  hours: number[] = Array.from({ length: 24 }, (_, i) => i + 1);
  minutes: number[] = [0, 15, 30, 45];

  constructor(private fb: FormBuilder) {}

  onBuscar(): void {
    const autorizacion = this.group.get('autorizacionNumero')?.value?.trim();
    if (autorizacion && !this.searchLocked) {
      this.searchError = null;
      this.buscarAutorizacion.emit(autorizacion);
    }
  }

  ngOnInit(): void {
    if (!this.group.get('horaInicio')?.value) {
      this.group.get('horaInicio')?.setValue('01:00');
    }

    if (!this.group.get('horaFin')?.value) {
      this.group.get('horaFin')?.setValue('01:00');
    }
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

  updateTime(fieldName: string, hour: number, minute: number): void {
    const timeString = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    this.group.get(fieldName)?.setValue(timeString);
  }

  onHourChange(fieldName: string, hour: number): void {
    const currentValue = this.group.get(fieldName)?.value || '01:00';
    const minute = this.getMinuteFromTime(currentValue);
    this.updateTime(fieldName, hour, minute);
  }

  onMinuteChange(fieldName: string, minute: number): void {
    const currentValue = this.group.get(fieldName)?.value || '01:00';
    const hour = this.getHourFromTime(currentValue);
    this.updateTime(fieldName, hour, minute);
  }
}
