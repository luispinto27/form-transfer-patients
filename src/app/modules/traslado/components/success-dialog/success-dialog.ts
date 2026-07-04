import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

export interface SuccessDialogData {
  loading: boolean;
  message?: string;
  error?: boolean;
}

@Component({
  selector: 'app-success-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatProgressSpinnerModule, MatIconModule],
  template: `
    <div class="content">
      <!-- Loading state -->
      <ng-container *ngIf="data.loading">
        <div class="loading-content">
          <mat-spinner diameter="56"></mat-spinner>
          <p class="loading-text">Generando formulario, por favor espere...</p>
        </div>
      </ng-container>

      <!-- Error state -->
      <ng-container *ngIf="!data.loading && data.error">
        <div class="result-content error-content">
          <mat-icon class="result-icon error-icon">error_outline</mat-icon>
          <h2 class="result-title">Ocurrió un error</h2>
          <p class="result-subtitle">No se pudo generar el formulario. Intenta nuevamente.</p>
          <mat-dialog-actions align="center">
            <button mat-raised-button color="warn" (click)="close()">Cerrar</button>
          </mat-dialog-actions>
        </div>
      </ng-container>

      <!-- Success state -->
      <ng-container *ngIf="!data.loading && !data.error">
        <div class="result-content success-content">
          <mat-icon class="result-icon success-icon">check_circle</mat-icon>
          <h2 class="result-title">¡Todo listo!</h2>
          <p class="result-subtitle">
            {{ data.message || 'La información del traslado ha sido almacenada correctamente.' }}
          </p>
          <div class="success-details">
            <p>Tu servicio se guardó con éxito y ya puedes continuar con el siguiente paso.</p>
          </div>
          <mat-dialog-actions align="center" class="dialog-actions">
            <button mat-raised-button color="primary" class="primary-button" (click)="close()">Cerrar</button>
          </mat-dialog-actions>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    /* Dialog panel supplies outer padding/width; keep internal paddings for content */

    .loading-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
      padding: 24px 8px;
    }

    .content {
      width: min(520px, 92vw);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      margin: 0 auto;
      padding: 18px 20px;
      box-sizing: border-box;
    }

    .loading-text {
      font-size: 15px;
      color: rgba(0,0,0,0.6);
      margin: 0;
      text-align: center;
    }

    .result-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 8px 8px 0;
      gap: 14px;
    }

    .result-icon {
      font-size: 56px;
      width: 56px;
      height: 56px;
      line-height: 56px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-top: 0;
    }

    .success-icon { color: #4caf50; }
    .error-icon   { color: #f44336; }

    .result-title {
      margin: 8px 0 4px;
      font-size: 20px;
      font-weight: 700;
    }

    .result-subtitle {
      margin: 0 0 8px;
      color: rgba(0,0,0,0.6);
      font-size: 14px;
    }

    .form-number-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: #f5f5f5;
      border-radius: 8px;
      padding: 12px 32px;
      margin-bottom: 12px;
      gap: 4px;
    }

    .success-icon { color: #4caf50; }
    .error-icon   { color: #f44336; }

    .result-title {
      margin: 16px 0 8px;
      font-size: 22px;
      font-weight: 700;
      letter-spacing: 0.2px;
    }

    .result-subtitle {
      margin: 0 0 16px;
      color: rgba(0,0,0,0.72);
      font-size: 15px;
      line-height: 1.6;
    }

    .success-details {
      background: rgba(76, 175, 80, 0.06);
      border: 1px solid rgba(76, 175, 80, 0.12);
      border-radius: 10px;
      padding: 12px 14px;
      margin-bottom: 12px;
      width: 100%;
      color: rgba(0,0,0,0.78);
      font-size: 14px;
      line-height: 1.6;
      text-align: left;
    }

    .dialog-actions {
      display: flex;
      gap: 12px;
      margin-top: 12px;
      flex-wrap: wrap;
      justify-content: center;
      padding-bottom: 6px;
    }

    .primary-button {
      min-width: 120px;
      padding: 10px 20px;
      box-shadow: 0 6px 18px rgba(25, 118, 210, 0.12);
      border-radius: 999px;
    }
  `]
})
export class SuccessDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: SuccessDialogData,
    private readonly dialogRef: MatDialogRef<SuccessDialog>,
    private readonly cdr: ChangeDetectorRef
  ) {}

  updateData(patch: Partial<SuccessDialogData>): void {
    Object.assign(this.data, patch);
    this.cdr.markForCheck();
  }

  close(): void {
    const result = this.data?.error ? 'error' : 'success';
    this.dialogRef.close(result);
  }
}
