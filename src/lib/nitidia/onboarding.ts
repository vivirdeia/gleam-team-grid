import { hoyISO, nuevoId, setDB } from "./store";
import type { Cliente, Cuadrilla, Empresa, Frecuencia, TipoEspacio } from "./types";

export function slugificar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
}

const NOMBRES_CUADRILLA = ["Cuadrilla Alba", "Cuadrilla Brisa", "Cuadrilla Nova", "Cuadrilla Orión"];
const COLORES = ["#2f9fb8", "#3fae8f", "#7a8cd6", "#d29a4a"];
const RESPONSABLES = ["Lucía Ferrer", "Marcos Peña", "Nadia Ortiz", "Rubén Salas"];
const INTEGRANTES = [
  ["Sara Nieto", "Iván Cruz"],
  ["Paula Gil", "Tomás Vidal"],
  ["Alba Moreno", "Hugo Cano"],
];

const CLIENTES_BASE: {
  nombre: string;
  contacto: string;
  tipo: TipoEspacio;
  calle: string;
  metros: number;
  frecuencia: Frecuencia;
  tarifa: number;
  acceso: { portero?: string; llaves?: string; alarma?: string; notas?: string };
}[] = [
  {
    nombre: "Vivienda Familia Rueda",
    contacto: "Marta Rueda",
    tipo: "hogar",
    calle: "Calle de los Olivos, 14",
    metros: 95,
    frecuencia: "semanal",
    tarifa: 72,
    acceso: { portero: "Portero de 8:00 a 15:00", llaves: "Copia en oficina", notas: "Perro pequeño" },
  },
  {
    nombre: "Estudio Kaizen Arquitectura",
    contacto: "Diego Almán",
    tipo: "oficina",
    calle: "Avenida Central, 8 · Planta 3",
    metros: 210,
    frecuencia: "quincenal",
    tarifa: 165,
    acceso: { alarma: "Código 4821", notas: "Acceso solo después de las 19:00" },
  },
  {
    nombre: "Ático Mirador",
    contacto: "Elsa Bermejo",
    tipo: "hogar",
    calle: "Plaza del Mercado, 3 · 7ºA",
    metros: 120,
    frecuencia: "mensual",
    tarifa: 110,
    acceso: { llaves: "Caja fuerte junto al buzón (2580)" },
  },
  {
    nombre: "Clínica Dental Sonrisa",
    contacto: "Dr. Pablo Sanz",
    tipo: "oficina",
    calle: "Calle Mayor, 51 · Bajo",
    metros: 140,
    frecuencia: "semanal",
    tarifa: 130,
    acceso: { portero: "Recepción", alarma: "Desactiva el equipo de guardia" },
  },
];

export interface AltaEmpresa {
  nombre: string;
  emailContacto: string;
  zona?: string;
}

/** Crea un tenant nuevo con datos demo generados y devuelve la empresa creada. */
export function registrarEmpresa({ nombre, emailContacto, zona }: AltaEmpresa): Empresa {
  const tenantId = nuevoId("em");
  const zonaBase = zona?.trim() || "Zona centro";
  const empresa: Empresa = {
    id: tenantId,
    nombre: nombre.trim(),
    slug: slugificar(nombre) || tenantId,
    emailContacto: emailContacto.trim(),
    plan: "prueba",
    alta: hoyISO(),
    activo: true,
    pinAdmin: "0000",
  };

  const numCuadrillas = 2;
  const cuadrillas: Cuadrilla[] = Array.from({ length: numCuadrillas }, (_, i) => ({
    id: nuevoId("cu"),
    tenantId,
    nombre: NOMBRES_CUADRILLA[i] ?? `Cuadrilla ${i + 1}`,
    responsable: RESPONSABLES[i] ?? "Responsable",
    integrantes: INTEGRANTES[i] ?? ["Equipo de limpieza"],
    zona: i === 0 ? zonaBase : `${zonaBase} · periferia`,
    disponibilidad: i === 0 ? "Lunes a viernes · 8:00-16:00" : "Lunes a sábado · 15:00-22:00",
    color: COLORES[i] ?? "#2f9fb8",
    pin: `${1111 * (i + 1)}`.slice(0, 4),
    activa: true,
  }));

  const clientes: Cliente[] = CLIENTES_BASE.map((base, i) => ({
    id: nuevoId("cl"),
    tenantId,
    nombre: base.nombre,
    contacto: base.contacto,
    telefono: `6${String(10000000 + Math.floor(Math.random() * 89999999))}`,
    email: `${slugificar(base.contacto)}@ejemplo.es`,
    tipo: base.tipo,
    direccion: `${base.calle} · ${zonaBase}`,
    zona: zonaBase,
    metros: base.metros,
    frecuencia: base.frecuencia,
    tarifa: base.tarifa,
    acceso: base.acceso,
    cuadrillaId: cuadrillas[i % cuadrillas.length]?.id ?? cuadrillas[0]!.id,
    activo: true,
    alta: hoyISO(),
  }));

  setDB((db) => ({
    ...db,
    empresas: [...db.empresas, empresa],
    cuadrillas: [...db.cuadrillas, ...cuadrillas],
    clientes: [...db.clientes, ...clientes],
  }));

  return empresa;
}
