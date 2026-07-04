/**
 * Form Fields Constants
 * Configuration for form field validators and field mappings
 */

import { Validators } from '@angular/forms';

export const FIELDS_TO_TOGGLE_VALIDATORS = [
  // Traslado — only fields not required on a failed transfer
  'traslado.origen',
  'traslado.horaInicio',
  'traslado.destino',
  'traslado.horaFin',
  // Antecedentes
  'antecedentes.dxPrincipal',
  // Examen
  'examen.descripcion',
  // Conducta
  'conducta.conducta',
  'conducta.horaInicioEspera',
  'conducta.horaFinEspera',
  // Firmas
  'firmas.medico',
  'firmas.enfermeria',
  'firmas.conductor',
  'firmas.familiar',
  'firmas.entidadReceptora'
];

export const FIELD_LABELS: { [key: string]: string } = {
  // Traslado
  'traslado.fecha': 'Fecha del traslado',
  'traslado.entidad': 'Nombre de la entidad',
  'traslado.autorizadoPor': 'Autorizado por',
  'traslado.autorizacionNumero': 'Número de autorización',
  'traslado.movil': 'Móvil',
  'traslado.tipo': 'Tipo de traslado',
  'traslado.origen': 'Origen del traslado',
  'traslado.horaInicio': 'Hora de inicio',
  'traslado.destino': 'Destino del traslado',
  'traslado.horaFin': 'Hora de finalización',
  // Paciente
  'paciente.nombreCompleto': 'Nombre completo del paciente',
  'paciente.tipoDocumento': 'Tipo de documento',
  'paciente.numeroDocumento': 'Número de documento',
  'paciente.sexo': 'Sexo',
  'paciente.edad': 'Edad del paciente',
  'paciente.direccion': 'Dirección',
  'paciente.barrio': 'Barrio',
  'paciente.ciudad': 'Ciudad',
  'paciente.telefono': 'Teléfono',
  'paciente.motivoTraslado': 'Motivo de traslado',
  'paciente.tratamiento': 'Tratamiento',
  // Antecedentes
  'antecedentes.dxPrincipal': 'Diagnóstico principal',
  // Signos Vitales
  'signos.hora': 'Hora (Signos Vitales)',
  'signos.ta': 'TA (Signos Vitales)',
  'signos.fc': 'FC (Signos Vitales)',
  'signos.fr': 'FR (Signos Vitales)',
  'signos.temperatura': 'Temperatura (Signos Vitales)',
  'signos.glicemia': 'Glicemia (Signos Vitales)',
  'signos.spo2': 'SpO₂ (Signos Vitales)',
  'signos.glasgow': 'Glasgow (Signos Vitales)',
  'signos.dxSecundario': 'Diagnóstico secundario (Signos Vitales)',
  // Examen
  'examen.descripcion': 'Descripción del examen físico',
  // Gastos
  'registroGasto.descripcion': 'Descripción (Gastos)',
  'registroGasto.cantidad': 'Cantidad (Gastos)',
  // Conducta
  'conducta.conducta': 'Conducta',
  'conducta.horaInicioEspera': 'Hora de inicio de espera',
  'conducta.horaFinEspera': 'Hora de finalización de espera',
  // Firmas
  'firmas.medico': 'Firma del médico',
  'firmas.enfermeria': 'Firma de enfermería',
  'firmas.conductor': 'Firma del conductor',
  'firmas.familiar': 'Firma del familiar',
  'firmas.entidadReceptora': 'Firma de la entidad receptora'
};

export const FORM_FIELD_VALIDATORS: { [key: string]: any } = {
  'traslado.fecha': [Validators.required],
  'traslado.entidad': [Validators.required],
  'traslado.autorizadoPor': [Validators.required],
  'traslado.autorizacionNumero': [Validators.required],
  'traslado.movil': [Validators.required],
  'traslado.tipo': [Validators.required],
  'traslado.origen': [Validators.required],
  'traslado.horaInicio': [Validators.required],
  'traslado.destino': [Validators.required],
  'traslado.horaFin': [Validators.required],
  'paciente.nombreCompleto': [Validators.required, Validators.minLength(3)],
  'paciente.tipoDocumento': [Validators.required],
  'paciente.numeroDocumento': [Validators.required, Validators.minLength(5)],
  'paciente.sexo': [Validators.required],
  'paciente.edad': [Validators.required, Validators.min(0), Validators.max(150)],
  'paciente.direccion': [Validators.required],
  'paciente.barrio': [Validators.required],
  'paciente.ciudad': [Validators.required],
  'paciente.telefono': [Validators.required, Validators.pattern(/^\d{7,10}$/)],
  'paciente.motivoTraslado': [Validators.required],
  'paciente.tratamiento': [Validators.required],
  'antecedentes.dxPrincipal': [Validators.required],
  'examen.descripcion': [Validators.required],
  'conducta.conducta': [Validators.required, Validators.minLength(3)],
  'conducta.horaInicioEspera': [Validators.required],
  'conducta.horaFinEspera': [Validators.required],
  'firmas.medico': [Validators.required],
  'firmas.enfermeria': [Validators.required],
  'firmas.conductor': [Validators.required],
  'firmas.familiar': [Validators.required],
  'firmas.entidadReceptora': [Validators.required]
};

export const SIGNOS_FIELD_VALIDATORS: { [key: string]: any } = {
  hora: [Validators.required],
  ta: [Validators.required, Validators.pattern(/^\d{2,3}\/\d{2,3}$/)],
  fc: [Validators.required, Validators.min(1)],
  fr: [Validators.required, Validators.min(1)],
  temperatura: [Validators.required, Validators.min(35)],
  glicemia: [Validators.required, Validators.min(30)],
  spo2: [Validators.required, Validators.min(50)],
  glasgow: [Validators.required, Validators.min(1)],
  dxSecundario: [Validators.required]
};

export const GASTO_FIELD_VALIDATORS: { [key: string]: any } = {
  descripcion: [Validators.required, Validators.minLength(3)],
  cantidad: [Validators.required, Validators.min(0.01)]
};
