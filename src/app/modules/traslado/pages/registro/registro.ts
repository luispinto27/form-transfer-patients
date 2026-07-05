import { Component, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { switchMap, timeout } from 'rxjs';
import { Router } from '@angular/router';
import { ServicioService, ServicioResponse } from '../../../../services/servicio.service';
import { PdfService, GeneratePdfResponse } from '../../../../services/generar-pdf';
import { AuthService } from '../../../../services/auth.service';
import { FIELDS_TO_TOGGLE_VALIDATORS, FIELD_LABELS, FORM_FIELD_VALIDATORS, SIGNOS_FIELD_VALIDATORS, GASTO_FIELD_VALIDATORS } from '../../../../constants/form-fields.constants';

import { MatStepperModule } from '@angular/material/stepper';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// Step components
import { TrasladoStep } from '../../steps/traslado-step/traslado-step';
import { PacienteStep } from "../../steps/paciente-step/paciente-step";
import { AntecedentesStep } from "../../steps/antecedentes-step/antecedentes-step";
import { SignosStep } from "../../steps/signos-step/signos-step";
import { ExamenStep } from "../../steps/examen-step/examen-step";
import { GastoStep } from "../../steps/gasto-step/gasto-step";
import { ConductaStep } from "../../steps/conducta-step/conducta-step";
import { FirmasStep } from '../../steps/firmas-step/firmas-step';
import { ValidationErrorDialog } from '../../components/validation-error-dialog/validation-error-dialog';
import { SuccessDialog } from '../../components/success-dialog/success-dialog';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    // Steps
    TrasladoStep,
    PacienteStep,
    AntecedentesStep,
    SignosStep,
    ExamenStep,
    GastoStep,
    ConductaStep,
    FirmasStep
],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})

  export class Registro {

    @ViewChild('stepper')
    stepper: any;

    @ViewChild('stepper', { read: ElementRef })
    stepperRef?: ElementRef;

    @ViewChild(FirmasStep)
    firmasStep?: FirmasStep;

    form: FormGroup;
    isMobile = false;
    isSearching = false;
    searchLocked = false;
    searchError: string | null = null;

    constructor(
      private readonly fb: FormBuilder,
      private readonly breakpointObserver: BreakpointObserver,
      private readonly servicioService: ServicioService,
      private readonly pdfService: PdfService,
      private readonly dialog: MatDialog,
      private readonly auth: AuthService,
      private readonly router: Router,
      private readonly cdr: ChangeDetectorRef
    ) {

      const today = new Date().toISOString().split('T')[0];

      this.form = this.fb.group({
        traslado: this.fb.group({
          fecha: [today, Validators.required],
          codigo: ['', Validators.required],
          entidad: ['', Validators.required],
          autorizadoPor: ['', Validators.required],
          autorizacionNumero: ['', Validators.required],
          movil: ['', Validators.required],
          tipo: ['', Validators.required],
          origen: ['', Validators.required],
          horaInicio: ['01:00', Validators.required],
          destino: ['', Validators.required],
          horaFin: ['01:00', Validators.required],
          retorno: [false],
          trasladoFallido: [false]
        }),

        paciente: this.fb.group({
          nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
          tipoDocumento: ['', Validators.required],
          numeroDocumento: ['', [Validators.required, Validators.minLength(5)]],
          sexo: ['', Validators.required],
          edad: ['', [Validators.required, Validators.min(0), Validators.max(150)]],
          direccion: ['', Validators.required],
          barrio: ['', Validators.required],
          ciudad: ['', Validators.required],
          telefono: ['', [Validators.required, Validators.pattern(/^\d{7,10}$/)]],
          motivoTraslado: ['', Validators.required],
          tratamiento: ['', Validators.required]
        }),

        conducta: this.fb.group({
          conducta: ['', [Validators.required, Validators.minLength(3)]],
          horaInicioEspera: ['01:00', Validators.required],
          horaFinEspera: ['01:00', Validators.required],
          estadoEntrega: [false],
        }),

        antecedentes: this.fb.group({
          acv: [false],
          alergia: [false],
          artritis: [false],
          asma: [false],
          cancer: [false],
          cardiacos: [false],
          dislipidemia: [false],
          epoc: [false],
          fallaRenal: [false],
          diabetes: [false],
          ginecoObstetricos: [false],
          hipertension: [false],
          quirurgicos: [false],
          psiquiatricos: [false],
          otros: [false],

          dxPrincipal: ['', Validators.required]
        }),

        signos: this.fb.array([]),
        examen: this.fb.group({
          cabeza: [false],
          ojos: [false],
          orl: [false],
          cuello: [false],
          cardiovascular: [false],
          pulmonar: [false],
          abdomen: [false],
          gastrointestinal: [false],
          genitourinario: [false],
          extremidades: [false],
          neurologico: [false],
          psiquiatrico: [false],

          descripcion: ['', Validators.required],
        }),
        registroGasto: this.fb.array([]),
        firmas: this.fb.group({
          medico: ['', Validators.required],
          enfermeria: ['', Validators.required],
          conductor: ['', Validators.required],
          familiar: ['', Validators.required],
          entidadReceptora: ['', Validators.required]
        })
    });

      this.form.get('traslado.autorizacionNumero')?.valueChanges.subscribe(() => {
        this.searchLocked = false;
      });

      // Vertical stepper on phones and portrait tablets (not enough width for
      // 8 horizontal steps); horizontal on landscape tablets and desktop.
      this.breakpointObserver
        .observe([Breakpoints.Handset, Breakpoints.TabletPortrait])
        .subscribe(result => {
          this.isMobile = result.matches;
        });
      this.agregarSignoVital();
      this.agregarGasto();



      // Watch trasladoFallido to enable/disable validators
      this.form.get('traslado.trasladoFallido')?.valueChanges.subscribe(trasladoFallido => {
        this.updateValidatorsBasedOnTrasladoFallido(trasladoFallido);
      });
    }

    private updateValidatorsBasedOnTrasladoFallido(trasladoFallido: boolean): void {
      FIELDS_TO_TOGGLE_VALIDATORS.forEach(fieldPath => {
        const control = this.form.get(fieldPath);
        if (control) {
          if (trasladoFallido) {
            control.clearValidators();
          } else {
            this.applyOriginalValidators(fieldPath, control);
          }
          control.updateValueAndValidity({ emitEvent: false });
        }
      });

      // Toggle validators for signos vitales array
      this.signosArray.controls.forEach(control => {
        if (control instanceof FormGroup) {
          Object.keys(control.controls).forEach(key => {
            const field = control.get(key);
            if (field) {
              if (trasladoFallido) {
                field.clearValidators();
              } else {
                this.applyOriginalSignosValidators(key, field);
              }
              field.updateValueAndValidity({ emitEvent: false });
            }
          });
          if (trasladoFallido) {
            this.lockSignosNumberFields(control);
          } else {
            this.unlockSignosNumberFields(control);
          }
        }
      });

      // Toggle validators for registroGasto array
      this.gastoArray.controls.forEach(control => {
        if (control instanceof FormGroup) {
          Object.keys(control.controls).forEach(key => {
            const field = control.get(key);
            if (field) {
              if (trasladoFallido) {
                field.clearValidators();
              } else {
                this.applyOriginalGastoValidators(key, field);
              }
              field.updateValueAndValidity({ emitEvent: false });
            }
          });
          if (trasladoFallido) {
            this.lockGastoNumberFields(control);
          } else {
            this.unlockGastoNumberFields(control);
          }
        }
      });
    }

    private readonly SIGNOS_NUMBER_FIELDS = ['fc', 'fr', 'temperatura', 'glicemia', 'spo2', 'glasgow'];

    private lockSignosNumberFields(group: FormGroup): void {
      this.SIGNOS_NUMBER_FIELDS.forEach(key => {
        const field = group.get(key);
        if (field) {
          field.setValue(0, { emitEvent: false });
          field.disable({ emitEvent: false });
        }
      });
    }

    private unlockSignosNumberFields(group: FormGroup): void {
      this.SIGNOS_NUMBER_FIELDS.forEach(key => {
        const field = group.get(key);
        if (field) {
          field.enable({ emitEvent: false });
        }
      });
    }

    private lockGastoNumberFields(group: FormGroup): void {
      const field = group.get('cantidad');
      if (field) {
        field.setValue(0, { emitEvent: false });
        field.disable({ emitEvent: false });
      }
    }

    private unlockGastoNumberFields(group: FormGroup): void {
      const field = group.get('cantidad');
      if (field) {
        field.enable({ emitEvent: false });
      }
    }

    private applyOriginalValidators(fieldPath: string, control: any): void {
      const validators = FORM_FIELD_VALIDATORS[fieldPath];
      if (validators) {
        control.setValidators(validators);
      }
    }

    private applyOriginalSignosValidators(fieldName: string, control: any): void {
      const validators = SIGNOS_FIELD_VALIDATORS[fieldName];
      if (validators) {
        control.setValidators(validators);
      }
    }

    private applyOriginalGastoValidators(fieldName: string, control: any): void {
      const validators = GASTO_FIELD_VALIDATORS[fieldName];
      if (validators) {
        control.setValidators(validators);
      }
    }

    get trasladoGroup(): FormGroup {
      return this.form.get('traslado') as FormGroup;
    }

    get pacienteGroup(): FormGroup {
      return this.form.get('paciente') as FormGroup;
    }

    get antecedentesGroup(): FormGroup {
      return this.form.get('antecedentes') as FormGroup;
    }

    get signosArray(): FormArray {
      return this.form.get('signos') as FormArray;
    }

    get examenGroup(): FormGroup {
      return this.form.get('examen') as FormGroup;
    }

    get gastoArray(): FormArray {
      return this.form.get('registroGasto') as FormArray;
    }

    get conductaGroup(): FormGroup {
      return this.form.get('conducta') as FormGroup;
    }

    get firmasGroup(): FormGroup {
      return this.form.get('firmas') as FormGroup;
    }

    crearSignoVital(): FormGroup {
      return this.fb.group({
        hora: ['01:00', Validators.required],
        ta: ['', [Validators.required, Validators.pattern(/^\d{2,3}\/\d{2,3}$/)]],
        fc: ['', [Validators.required, Validators.min(40), Validators.max(200)]],
        fr: ['', [Validators.required, Validators.min(10), Validators.max(50)]],
        temperatura: ['', [Validators.required, Validators.min(35), Validators.max(42)]],
        glicemia: ['', [Validators.required, Validators.min(40), Validators.max(500)]],
        spo2: ['', [Validators.required, Validators.min(80), Validators.max(100)]],
        glasgow: ['', [Validators.required, Validators.min(3), Validators.max(15)]],
        dxSecundario: ['', Validators.required]
      });
    }

    agregarSignoVital(): void {
      const group = this.crearSignoVital();
      this.signosArray.push(group);
      if (this.form.get('traslado.trasladoFallido')?.value) {
        this.lockSignosNumberFields(group);
      }
    }

    eliminarSignoVital(index: number): void {
      if (this.signosArray.length > 1) {
        this.signosArray.removeAt(index);
      }
    }

    crearGasto(): FormGroup {
      return this.fb.group({
        descripcion: ['', [Validators.required, Validators.minLength(3)]],
        cantidad: ['', [Validators.required, Validators.min(0.01)]]
      });
    }

    agregarGasto(): void {
      const group = this.crearGasto();
      this.gastoArray.push(group);
      if (this.form.get('traslado.trasladoFallido')?.value) {
        this.lockGastoNumberFields(group);
      }
    }

    eliminarGasto(index: number): void {
      if (this.gastoArray.length > 1) {
        this.gastoArray.removeAt(index);
      }
    }

    finalizar(): void {
      this.form.markAllAsTouched();

      const trasladoFallido = this.form.get('traslado.trasladoFallido')?.value || false;

      const errors = this.getFormErrors(trasladoFallido);
      if (this.form.invalid || errors.length > 0) {
        this.showValidationErrorDialog(errors);
        return;
      }

      const dto = {
        traslado: this.form.value.traslado,
        paciente: this.form.value.paciente,
        antecedentes: this.form.value.antecedentes,
        signos: this.form.value.signos,
        examen: this.form.value.examen,
        gastos: this.form.value.registroGasto,
        conducta: this.form.value.conducta,
        firmas: this.form.value.firmas
      };

      console.log('DTO a enviar al backend:', dto);

      const dialogRef = this.dialog.open(SuccessDialog, {
        data: { loading: true },
        disableClose: true,
        width: '520px',
        maxWidth: '92vw',
        panelClass: 'shared-dialog-panel'
      });

      // Always listen for dialog close so we can reset the form when user confirms
      dialogRef.afterClosed().subscribe(result => {
        if (result === 'success') {
          this.resetForm();
        }
      });

      let pdfGenerado: GeneratePdfResponse;

      this.pdfService.generatePdf(dto).pipe(
        switchMap(pdf => {
          pdfGenerado = pdf;
          const dtoConHistoria = { ...dto, pdfHistoria: pdf.fileBase64 };
          return this.servicioService.guardarTraslado(dtoConHistoria);
        })
      ).subscribe({
        next: (guardar) => {
          if (!guardar?.ok) {
            dialogRef.componentInstance.updateData({
              loading: false,
              error: true,
              message: guardar?.mensaje || 'No se pudo guardar el traslado.'
            });
            return;
          }

          this.descargarPdf(pdfGenerado);

          dialogRef.componentInstance.updateData({
            loading: false,
            error: false,
            message: guardar.mensaje || 'Información almacenada correctamente.'
          });
        },
        error: (err) => {
          console.error('Error generando el PDF o guardando el traslado', err);
          dialogRef.componentInstance.updateData({
            loading: false,
            error: true,
            message: 'Ocurrió un error al generar el PDF o guardar el traslado. Intente de nuevo.'
          });
        }
      });
    }

    private descargarPdf(pdf: GeneratePdfResponse): void {
      const byteChars = atob(pdf.fileBase64);
      const byteNumbers = new Array(byteChars.length);
      for (let i = 0; i < byteChars.length; i++) {
        byteNumbers[i] = byteChars.codePointAt(i)!;
      }
      const blob = new Blob([new Uint8Array(byteNumbers)], { type: 'application/pdf' });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = pdf.fileName || 'traslado.pdf';
      link.click();
      URL.revokeObjectURL(url);
    }

    private getFormErrors(trasladoFallido = false): string[] {
      const errors: string[] = [];

      const checkControl = (control: any, path: string) => {
        if (control?.errors) {
          // Remove array indices from path for cleaner display
          const cleanPath = path.replace(/\[\d+\]\./g, '.');
          const label = FIELD_LABELS[cleanPath] || cleanPath;
          if (control.errors['required']) {
            errors.push(`${label} es requerido`);
          } else if (control.errors['minlength']) {
            errors.push(`${label} debe tener mínimo ${control.errors['minlength'].requiredLength} caracteres`);
          } else if (control.errors['min']) {
            errors.push(`${label} debe ser mayor a ${control.errors['min'].min}`);
          } else if (control.errors['max']) {
            errors.push(`${label} debe ser menor a ${control.errors['max'].max}`);
          } else if (control.errors['pattern']) {
            errors.push(`${label} tiene un formato inválido`);
          }
        }
      };

      // Check all form controls recursively
      const checkGroup = (group: FormGroup, basePath: string = '') => {
        Object.keys(group.controls).forEach(key => {
          const control = group.get(key);
          const path = basePath ? `${basePath}.${key}` : key;

          if (control instanceof FormGroup) {
            checkGroup(control, path);
          } else if (control instanceof FormArray) {
            control.controls.forEach((item, index) => {
              if (item instanceof FormGroup) {
                checkGroup(item, `${path}[${index}]`);
              } else {
                checkControl(item, path);
              }
            });
          } else {
            checkControl(control, path);
          }
        });
      };

      checkGroup(this.form);

      if (!trasladoFallido && this.signosArray.length < 1) {
        errors.push('❌ Debe registrar al menos 1 signo vital');
      }

      return errors;
    }

    private resetForm(): void {
      const today = new Date().toISOString().split('T')[0];

      // Fully reset the stepper FIRST. Unlike setting `selectedIndex = 0`, this
      // clears every step's "interacted/completed" flag, so the steps go back to
      // plain numbers instead of showing the pencil/done icons ("processed").
      // It also resets each step's control, so we re-seed defaults afterwards.
      this.stepper?.reset();

      this.form.reset({
        traslado: {
          fecha: today,
          horaInicio: '01:00',
          horaFin: '01:00',
          retorno: false,
          trasladoFallido: false
        },
        conducta: {
          horaInicioEspera: '01:00',
          horaFinEspera: '01:00',
          estadoEntrega: false
        }
      });

      this.signosArray.clear();
      this.gastoArray.clear();
      this.agregarSignoVital();
      this.agregarGasto();

      // Clear any drawn signatures in FirmaPad components
      this.firmasStep?.firmas?.forEach(pad => pad.limpiar());

      // Ensure the fresh form shows no validation styling (no red fields/labels).
      this.form.markAsUntouched();
      this.form.markAsPristine();
      this.searchLocked = false;
      this.searchError = null;
    }

    /** Control that backs each step, in stepper order. */
    getStepControl(index: number): AbstractControl | null {
      switch (index) {
        case 0: return this.trasladoGroup;
        case 1: return this.pacienteGroup;
        case 2: return this.antecedentesGroup;
        case 3: return this.signosArray;
        case 4: return this.examenGroup;
        case 5: return this.gastoArray;
        case 6: return this.conductaGroup;
        case 7: return this.firmasGroup;
        default: return null;
      }
    }

    logout(): void {
      this.auth.logout();
      this.router.navigate(['/login']);
    }

    nextStep(): void {
      const index = this.stepper?.selectedIndex ?? 0;
      const control = this.getStepControl(index);

      if (control) {
        control.markAllAsTouched();
        if (control.invalid) {
          // Show inline errors and take the user to the first one
          this.scrollToFirstError();
          return;
        }
      }

      this.stepper?.next();
      this.scrollToTop();
    }

    previousStep(): void {
      this.stepper?.previous();
      this.scrollToTop();
    }

    private scrollToTop(): void {
      setTimeout(() => {
        // Move the whole page back to the top so every step change lands the
        // user at the header/first field instead of mid-scroll.
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        this.scrollActiveStepIntoView();
      }, 120);
    }

    /** Keep the active step visible in the horizontally-scrollable rail (mobile). */
    private scrollActiveStepIntoView(): void {
      const header = this.stepperRef?.nativeElement?.querySelector(
        '.mat-horizontal-stepper-header[aria-selected="true"]'
      ) as HTMLElement | null;
      header?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }

    private scrollToFirstError(): void {
      setTimeout(() => {
        const firstInvalid = this.stepperRef?.nativeElement?.querySelector(
          '.ng-invalid.ng-touched:not(form):not(mat-stepper):not([formgroupname]), .error-message'
        ) as HTMLElement | null;
        firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (firstInvalid && typeof firstInvalid.focus === 'function') {
          firstInvalid.focus({ preventScroll: true });
        }
      }, 100);
    }

    private showValidationErrorDialog(errors: string[]): void {
      this.dialog.open(ValidationErrorDialog, {
        width: '520px',
        maxWidth: '92vw',
        panelClass: 'shared-dialog-panel',
        data: { errors },
        disableClose: false
      });
    }

    onBuscarAutorizacion(autorizacion: string): void {
      this.isSearching = true;
      this.searchError = null;
      // Zoneless app: manually flag for change detection so the button reflects
      // the loading state (there is no zone.js to schedule a CD tick for us).
      this.cdr.markForCheck();

      this.servicioService.buscarServicio(autorizacion).pipe(
        // Safety net: never let the button spin forever if the request stalls.
        timeout(20000)
      ).subscribe({
        next: (servicio: ServicioResponse) => {
          this.isSearching = false;
          this.searchError = null;
          this.llenarFormularioConServicio(servicio);
          this.searchLocked = true;
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.isSearching = false;
          this.searchLocked = false;
          this.searchError = this.mapSearchError(err);
          this.cdr.markForCheck();
        }
      });
    }

    /** Turn an HTTP/timeout error into a user-facing message. */
    private mapSearchError(err: any): string {
      // rxjs `timeout` operator throws a TimeoutError (no HTTP status).
      if (err?.name === 'TimeoutError') {
        return 'La búsqueda tardó demasiado. Verifique su conexión e intente de nuevo.';
      }

      const status = err?.status;
      // The legacy PHP API returns the business result in the JSON body
      // ({ ok, codigo, mensaje }); prefer its message when present.
      const mensaje: string | undefined = err?.error?.mensaje;

      switch (status) {
        case 400:
          return mensaje || 'El número de autorización no es válido.';
        case 401:
        case 403:
          return 'No autorizado. Por favor intente nuevamente o contacte al administrador.';
        case 404:
          return mensaje || 'No se encontró ningún servicio con ese número de autorización.';
        case 0:
          return 'No se pudo conectar con el servidor. Verifique su conexión.';
        default:
          if (typeof status === 'number' && status >= 500) {
            return 'El servidor no está disponible en este momento. Intente más tarde.';
          }
          return mensaje || 'Ocurrió un error al buscar el servicio. Intente de nuevo.';
      }
    }

    private llenarFormularioConServicio(servicio: ServicioResponse): void {
      // Traslado fields
      const horaInicio = servicio.hora ? servicio.hora.substring(0, 5) : '01:00';
      this.trasladoGroup.patchValue({
        autorizacionNumero: servicio.autorizacion,
        fecha: servicio.fecha,
        codigo: servicio.codigo || servicio.servicio_codigo || '',
        entidad: servicio.entidad,
        autorizadoPor: servicio.solicitante,
        movil: servicio.datomovil || servicio.movil,
        tipo: servicio.tiposervicio || '',
        origen: servicio.origen,
        destino: servicio.destino,
        horaInicio,
        retorno: servicio.ida_vuelta?.toUpperCase() === 'SI'
      });

      // Paciente fields
      const nombreParts = [
        servicio.paciente,
        servicio.segundo_nombre,
        servicio.primer_apellido,
        servicio.segundo_apellido
      ].filter(p => p?.trim());
      const nombreCompleto = nombreParts.join(' ');

      this.pacienteGroup.patchValue({
        nombreCompleto: nombreCompleto,
        numeroDocumento: servicio.documento,
        edad: servicio.edad,
        direccion: servicio.direccionpaciente || '',
        telefono: servicio.telefonopaciente || '',
        ciudad: servicio.ciudad_origen,
        motivoTraslado: servicio.diagnosticos,
        tipoDocumento: servicio.tipopaciente,
      });

      // Antecedentes - diagnostico principal
      this.antecedentesGroup.patchValue({
        dxPrincipal: servicio.diagnosticos
      });
    }
}
