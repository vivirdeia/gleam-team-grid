// Modelo de datos de Nitidia (SaaS multi-tenant). Todo vive en localStorage.

export type TipoEspacio = "hogar" | "oficina";
export type Frecuencia = "puntual" | "semanal" | "quincenal" | "mensual";
export type EstadoServicio = "pendiente" | "en_curso" | "completado";
export type EstadoFactura = "pagada" | "pendiente";

/** Roles dentro de un tenant (empresa de limpieza). */
export type Rol = "admin" | "cuadrilla";

/** Planes de suscripción del SaaS. */
export type PlanSaaS = "prueba" | "starter" | "pro";

export const PLANES: Record<PlanSaaS, { etiqueta: string; precio: number; limiteClientes: number }> = {
  prueba: { etiqueta: "Prueba gratis", precio: 0, limiteClientes: 10 },
  starter: { etiqueta: "Starter", precio: 39, limiteClientes: 50 },
  pro: { etiqueta: "Pro", precio: 99, limiteClientes: 500 },
};

/** Tenant: empresa de limpieza suscrita a Nitidia. */
export interface Empresa {
  id: string;
  nombre: string; // nombre comercial
  slug: string;
  emailContacto: string;
  plan: PlanSaaS;
  alta: string; // ISO date
  activo: boolean;
}

export interface DatosAcceso {
  portero?: string;
  llaves?: string;
  alarma?: string;
  notas?: string;
}

export interface Cliente {
  id: string;
  tenantId: string;
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
  tenantId: string;
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
  tenantId: string;
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
  tenantId: string;
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
  empresas: Empresa[];
  clientes: Cliente[];
  cuadrillas: Cuadrilla[];
  servicios: Servicio[];
  facturas: Factura[];
}

/** Vista de la base de datos acotada a un tenant concreto. */
export interface TenantDB {
  empresa: Empresa;
  clientes: Cliente[];
  cuadrillas: Cuadrilla[];
  servicios: Servicio[];
  facturas: Factura[];
}

/** Sesión de dos niveles. */
export interface SesionSaaS {
  nivel: "saas";
  nombre: string;
  email?: string;
}

export interface SesionTenant {
  nivel: "tenant";
  tenantId: string;
  rol: Rol;
  nombre: string;
  cuadrillaId?: string;
}

export type Sesion = SesionSaaS | SesionTenant;

export const esSuperAdminSaaS = (s: Sesion | null): s is SesionSaaS => s?.nivel === "saas";
export const esUsuarioTenant = (s: Sesion | null): s is SesionTenant => s?.nivel === "tenant";
