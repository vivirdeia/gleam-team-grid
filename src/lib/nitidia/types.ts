// Modelo de datos de Nitidia. Todo vive en localStorage (sin backend).

export type TipoEspacio = "hogar" | "oficina";
export type Frecuencia = "puntual" | "semanal" | "quincenal" | "mensual";
export type EstadoServicio = "pendiente" | "en_curso" | "completado";
export type EstadoFactura = "pagada" | "pendiente";
export type Rol = "admin" | "cuadrilla";

export interface DatosAcceso {
  portero?: string;
  llaves?: string;
  alarma?: string;
  notas?: string;
}

export interface Cliente {
  id: string;
  nombre: string;
  contacto: string;
  telefono: string;
  email: string;
  tipo: TipoEspacio;
  direccion: string;
  zona: string;
  metros: number;
  frecuencia: Frecuencia;
  tarifa: number; // euros por servicio
  acceso: DatosAcceso;
  cuadrillaId?: string;
  activo: boolean;
  alta: string; // ISO date
}

export interface Cuadrilla {
  id: string;
  nombre: string;
  responsable: string;
  integrantes: string[];
  zona: string;
  disponibilidad: string;
  color: string;
  pin: string;
  activa: boolean;
}

export interface TareaChecklist {
  id: string;
  area: string;
  texto: string;
  hecha: boolean;
  foto?: string; // data URL
}

export interface Valoracion {
  puntuacion: number; // 1-5
  comentario?: string;
  fecha: string;
}

export interface Servicio {
  id: string;
  clienteId: string;
  cuadrillaId: string;
  fecha: string; // YYYY-MM-DD
  hora: string; // HH:mm
  duracion: number; // horas
  estado: EstadoServicio;
  checklist: TareaChecklist[];
  notas?: string;
  valoracion?: Valoracion;
  importe: number;
  facturaId?: string;
}

export interface Factura {
  id: string;
  numero: string;
  clienteId: string;
  periodo: string; // YYYY-MM
  emision: string;
  vencimiento: string;
  servicios: string[];
  base: number;
  iva: number;
  total: number;
  estado: EstadoFactura;
  pagadaEl?: string;
}

export interface NitidiaDB {
  version: number;
  clientes: Cliente[];
  cuadrillas: Cuadrilla[];
  servicios: Servicio[];
  facturas: Factura[];
}

export interface Sesion {
  rol: Rol;
  nombre: string;
  cuadrillaId?: string;
}
