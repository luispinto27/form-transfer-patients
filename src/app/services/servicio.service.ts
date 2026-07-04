import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ServicioResponse {
  servicio_codigo: string;
  origen: string;
  destino: string;
  fecha: string;
  hora: string;
  entidad: string;
  tiposervicio: string;
  movil: string;
  estado: string;
  descripcion: string;
  solicitante: string;
  edad: number;
  autorizacion: string;
  diagnosticos: string;
  documento: string;
  tipopaciente: string;
  paciente: string;
  segundo_nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  direccionpaciente: string | null;
  telefonopaciente: string | null;
  tipoedad: string | null;
  datomovil: string;
  codigo: string;
  ida_vuelta: string;
  diagnostico_legal: string;
  ciudad_origen: string;
  ciudad_destino: string;
  conductor: string;
  auxiliar: string;
  medico: string;
}

interface ServicioApiResponse {
  ok: boolean;
  codigo: number;
  mensaje: string;
  datos: ServicioResponse[];
}

interface GuardarTrasladoResponse {
  ok: boolean;
  codigo: number;
  mensaje: string;
  datos?: unknown;
}

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  private readonly API_URL = environment.servicioApiUrl;
  private readonly USUARIO = environment.servicioUsuario;
  private readonly PASSWORD = environment.servicioPassword;

  constructor(private readonly http: HttpClient) {}

  buscarServicio(autorizacion: string): Observable<ServicioResponse> {
    const body = {
      usuario: this.USUARIO,
      password: this.PASSWORD,
      datos: {
        autorizacion
      }
    };

    const params = new HttpParams()
      .set('page', 'Servicio')
      .set('api', 'Servicio.consumo');

    return this.http.post<ServicioApiResponse>(this.API_URL, body, { params }).pipe(
      map(response => {
        if (!response || !response.ok || !Array.isArray(response.datos) || response.datos.length === 0) {
          throw new Error(response?.mensaje || 'No se encontró ningún servicio en la respuesta');
        }
        return response.datos[0];
      })
    );
  }

  guardarTraslado(payload: any): Observable<GuardarTrasladoResponse> {
    const body = {
      usuario: this.USUARIO,
      password: this.PASSWORD,
      datos: payload
    };

    const params = new HttpParams()
      .set('page', 'Servicio')
      .set('api', 'Traslado.guardar');

    console.log('JSON enviado a Traslado.guardar:', JSON.stringify(body, null, 2));

    return this.http.post<GuardarTrasladoResponse>(this.API_URL, body, { params });
  }
}
