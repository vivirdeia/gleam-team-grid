import type {
  Cliente,
  Cuadrilla,
  Empresa,
  Factura,
  NitidiaDB,
  Servicio,
  TareaChecklist,
  TipoEspacio,
} from "./types";

// Plantillas de checklist por tipo de espacio
export const PLANTILLAS: Record<TipoEspacio, { area: string; tareas: string[] }[]> = {
  hogar: [
    { area: "Baño", tareas: ["Desinfectar sanitario", "Limpiar ducha y mampara", "Espejos y grifería", "Reponer papel y jabón"] },
    { area: "Cocina", tareas: ["Desengrasar encimera", "Limpiar electrodomésticos", "Fregadero y grifo", "Sacar basura"] },
    { area: "Salón", tareas: ["Aspirar suelo y alfombras", "Quitar polvo de superficies", "Ordenar cojines y mesas"] },
    { area: "Dormitorios", tareas: ["Cambiar ropa de cama", "Aspirar suelo", "Limpiar polvo"] },
    { area: "General", tareas: ["Fregar suelos", "Ventilar estancias", "Revisar cierre de ventanas"] },
  ],
  oficina: [
    { area: "Puestos de trabajo", tareas: ["Desinfectar mesas", "Limpiar pantallas y teclados", "Vaciar papeleras"] },
    { area: "Aseos", tareas: ["Desinfectar sanitarios", "Reponer consumibles", "Limpiar espejos y lavabos", "Fregar suelo"] },
    { area: "Cocina / office", tareas: ["Limpiar microondas y nevera exterior", "Fregadero", "Reponer bolsas de basura"] },
    { area: "Salas de reuniones", tareas: ["Mesas y sillas", "Pizarra", "Aspirar suelo"] },
    { area: "Zonas comunes", tareas: ["Recepción y accesos", "Cristales interiores", "Fregar pasillos"] },
  ],
};

export function plantillaChecklist(tipo: TipoEspacio): TareaChecklist[] {
  const lista: TareaChecklist[] = [];
  PLANTILLAS[tipo].forEach((bloque, i) => {
    bloque.tareas.forEach((texto, j) => {
      lista.push({ id: `t${i}-${j}`, area: bloque.area, texto, hecha: false });
    });
  });
  return lista;
}

function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}
function dias(offset: number) {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return iso(d);
}
function redondear(n: number) {
  return Math.round(n * 100) / 100;
}

/* ---------------- Empresas (tenants) ---------------- */

export const EMPRESAS: Empresa[] = [
  {
    id: "em1",
    nombre: "Brillo Madrid Servicios",
    slug: "brillo-madrid",
    emailContacto: "administracion@brillomadrid.es",
    plan: "pro",
    alta: "2025-09-01",
    activo: true,
    pinAdmin: "1234",
  },
  {
    id: "em2",
    nombre: "Clara Levante Limpiezas",
    slug: "clara-levante",
    emailContacto: "hola@claralevante.com",
    plan: "starter",
    alta: "2025-12-14",
    activo: true,
    pinAdmin: "2345",
  },
  {
    id: "em3",
    nombre: "NorteLimp Bilbao",
    slug: "nortelimp",
    emailContacto: "contacto@nortelimp.eus",
    plan: "prueba",
    alta: "2026-08-11",
    activo: true,
    pinAdmin: "3456",
  },
];

/* ---------------- Cuadrillas por tenant ---------------- */

type CuadrillaSemilla = Omit<Cuadrilla, "tenantId">;
type ClienteSemilla = Omit<Cliente, "tenantId">;

const CUADRILLAS_EM1: CuadrillaSemilla[] = [
  {
    id: "cu1",
    nombre: "Cuadrilla Azul",
    responsable: "Lucía Ferrer",
    integrantes: ["Lucía Ferrer", "Marta Ibáñez", "Samuel Ortiz"],
    zona: "Centro / Chamberí",
    disponibilidad: "L-V · 07:00 a 15:00",
    color: "#3aa7c9",
    pin: "1111",
    activa: true,
  },
  {
    id: "cu2",
    nombre: "Cuadrilla Menta",
    responsable: "Iván Cabrera",
    integrantes: ["Iván Cabrera", "Rocío Nadal"],
    zona: "Norte / Chamartín",
    disponibilidad: "L-S · 14:00 a 22:00",
    color: "#4bbf9a",
    pin: "2222",
    activa: true,
  },
  {
    id: "cu3",
    nombre: "Cuadrilla Aurora",
    responsable: "Nerea Solís",
    integrantes: ["Nerea Solís", "Diego Peña", "Aisha Ndiaye"],
    zona: "Sur / Arganzuela",
    disponibilidad: "L-V · 06:00 a 14:00",
    color: "#7c9fd6",
    pin: "3333",
    activa: true,
  },
];

const CUADRILLAS_EM2: CuadrillaSemilla[] = [
  {
    id: "cu1",
    nombre: "Equipo Marina",
    responsable: "Vicent Roig",
    integrantes: ["Vicent Roig", "Amparo Gil"],
    zona: "Ruzafa / Eixample",
    disponibilidad: "L-V · 08:00 a 16:00",
    color: "#2f9fb5",
    pin: "1111",
    activa: true,
  },
  {
    id: "cu2",
    nombre: "Equipo Albufera",
    responsable: "Noelia Server",
    integrantes: ["Noelia Server", "Youssef Amrani", "Pau Benet"],
    zona: "Campanar / Benimaclet",
    disponibilidad: "L-S · 15:00 a 22:00",
    color: "#58c2a0",
    pin: "2222",
    activa: true,
  },
];

const CUADRILLAS_EM3: CuadrillaSemilla[] = [
  {
    id: "cu1",
    nombre: "Talde Berdea",
    responsable: "Ainhoa Zubiri",
    integrantes: ["Ainhoa Zubiri", "Gorka Etxeberria"],
    zona: "Abando / Indautxu",
    disponibilidad: "L-V · 07:30 a 15:30",
    color: "#4a91c6",
    pin: "1111",
    activa: true,
  },
];

/* ---------------- Clientes por tenant ---------------- */

const CLIENTES_EM1: ClienteSemilla[] = [
  {
    id: "cl1",
    nombre: "Familia Álvarez Ruiz",
    contacto: "Marta Álvarez",
    telefono: "612 445 018",
    email: "marta.alvarez@correo.es",
    tipo: "hogar",
    direccion: "C/ Sagasta 14, 3ºB",
    zona: "Chamberí",
    metros: 105,
    frecuencia: "semanal",
    tarifa: 68,
    acceso: { portero: "Portero de 8 a 20h (Ramón)", llaves: "Copia en oficina · llavero 04", alarma: "Sin alarma", notas: "Perro pequeño, muy tranquilo" },
    cuadrillaId: "cu1",
    activo: true,
    alta: "2025-11-04",
  },
  {
    id: "cl2",
    nombre: "Estudio Marlo Arquitectura",
    contacto: "Pablo Marlo",
    telefono: "915 220 331",
    email: "hola@marloarq.com",
    tipo: "oficina",
    direccion: "C/ Génova 8, planta 2",
    zona: "Centro",
    metros: 240,
    frecuencia: "semanal",
    tarifa: 145,
    acceso: { portero: "Recepción del edificio", llaves: "Tarjeta de acceso nº 12", alarma: "Código 4471 (teclado entrada)", notas: "Acceder después de las 19:00" },
    cuadrillaId: "cu1",
    activo: true,
    alta: "2025-09-16",
  },
  {
    id: "cl3",
    nombre: "Clínica Dental Sonrisa",
    contacto: "Dra. Elena Vidal",
    telefono: "913 887 210",
    email: "recepcion@dentalsonrisa.es",
    tipo: "oficina",
    direccion: "Av. Bravo Murillo 220, bajo",
    zona: "Chamartín",
    metros: 160,
    frecuencia: "semanal",
    tarifa: 120,
    acceso: { portero: "Sin portero", llaves: "Llave propia de la cuadrilla", alarma: "Alarma Securitas · código 8802", notas: "Productos sin amoniaco" },
    cuadrillaId: "cu2",
    activo: true,
    alta: "2026-01-12",
  },
  {
    id: "cl4",
    nombre: "Familia Sanchís",
    contacto: "Jorge Sanchís",
    telefono: "699 310 224",
    email: "jsanchis@correo.es",
    tipo: "hogar",
    direccion: "C/ Alberto Alcocer 31, 8ºA",
    zona: "Chamartín",
    metros: 130,
    frecuencia: "quincenal",
    tarifa: 82,
    acceso: { portero: "Conserje 24h", llaves: "Entrega en conserjería", alarma: "Alarma desactivada por el cliente", notas: "Avisar 30 min antes" },
    cuadrillaId: "cu2",
    activo: true,
    alta: "2025-12-02",
  },
  {
    id: "cl5",
    nombre: "Coworking Nube Sur",
    contacto: "Iria Blanco",
    telefono: "910 774 552",
    email: "operaciones@nubesur.co",
    tipo: "oficina",
    direccion: "Paseo de las Delicias 60",
    zona: "Arganzuela",
    metros: 380,
    frecuencia: "semanal",
    tarifa: 210,
    acceso: { portero: "Sin portero", llaves: "Código puerta 5590*", alarma: "Sin alarma", notas: "Salas reservadas hasta las 21:00" },
    cuadrillaId: "cu3",
    activo: true,
    alta: "2025-10-21",
  },
  {
    id: "cl6",
    nombre: "Familia Otero Lima",
    contacto: "Carla Lima",
    telefono: "654 902 118",
    email: "carla.lima@correo.es",
    tipo: "hogar",
    direccion: "C/ Embajadores 145, 2ºC",
    zona: "Arganzuela",
    metros: 78,
    frecuencia: "mensual",
    tarifa: 74,
    acceso: { portero: "Sin portero", llaves: "Cliente presente en casa", alarma: "Sin alarma", notas: "Prefiere mañanas" },
    cuadrillaId: "cu3",
    activo: true,
    alta: "2026-02-09",
  },
  {
    id: "cl7",
    nombre: "Notaría Peral & Asociados",
    contacto: "Ana Peral",
    telefono: "914 002 190",
    email: "administracion@peralnotaria.es",
    tipo: "oficina",
    direccion: "C/ Orense 12, planta 5",
    zona: "Chamartín",
    metros: 195,
    frecuencia: "puntual",
    tarifa: 260,
    acceso: { portero: "Recepción hasta 18:00", llaves: "Acompañamiento de seguridad", alarma: "Alarma central del edificio", notas: "Limpieza de cristales incluida" },
    cuadrillaId: "cu2",
    activo: true,
    alta: "2026-03-01",
  },
];

const CLIENTES_EM2: ClienteSemilla[] = [
  {
    id: "cl1",
    nombre: "Apartamentos Turia Stay",
    contacto: "Sonia Cebrián",
    telefono: "963 118 240",
    email: "reservas@turiastay.com",
    tipo: "hogar",
    direccion: "C/ Cuba 32, 1ª y 2ª planta",
    zona: "Ruzafa",
    metros: 190,
    frecuencia: "semanal",
    tarifa: 130,
    acceso: { portero: "Sin portero", llaves: "Caja fuerte de llaves · código 3390", alarma: "Sin alarma", notas: "Limpieza entre check-outs, antes de las 15:00" },
    cuadrillaId: "cu1",
    activo: true,
    alta: "2025-12-20",
  },
  {
    id: "cl2",
    nombre: "Gestoría Bonaire",
    contacto: "Rafa Server",
    telefono: "961 442 077",
    email: "info@gestoriabonaire.es",
    tipo: "oficina",
    direccion: "C/ Colón 18, planta 4",
    zona: "Eixample",
    metros: 210,
    frecuencia: "semanal",
    tarifa: 135,
    acceso: { portero: "Conserje de 8 a 19h", llaves: "Juego propio de la empresa", alarma: "Código 7712", notas: "No tocar archivadores abiertos" },
    cuadrillaId: "cu1",
    activo: true,
    alta: "2026-01-08",
  },
  {
    id: "cl3",
    nombre: "Familia Ferrandis Gil",
    contacto: "Empar Gil",
    telefono: "622 780 145",
    email: "empar.gil@correo.es",
    tipo: "hogar",
    direccion: "Av. Blasco Ibáñez 90, 5ºD",
    zona: "Benimaclet",
    metros: 96,
    frecuencia: "quincenal",
    tarifa: 72,
    acceso: { portero: "Sin portero", llaves: "Copia en oficina · llavero 11", alarma: "Sin alarma", notas: "Dos gatos en casa" },
    cuadrillaId: "cu2",
    activo: true,
    alta: "2026-02-02",
  },
  {
    id: "cl4",
    nombre: "Escuela Infantil Petit Sol",
    contacto: "Marina Tortosa",
    telefono: "960 335 891",
    email: "direccion@petitsol.es",
    tipo: "oficina",
    direccion: "C/ Campanar 41",
    zona: "Campanar",
    metros: 320,
    frecuencia: "semanal",
    tarifa: 190,
    acceso: { portero: "Sin portero", llaves: "Llave y mando de garaje", alarma: "Alarma propia · código 5104", notas: "Solo productos con certificado infantil" },
    cuadrillaId: "cu2",
    activo: true,
    alta: "2026-03-16",
  },
  {
    id: "cl5",
    nombre: "Clínica Fisio Marítim",
    contacto: "Hugo Serrano",
    telefono: "963 907 412",
    email: "hola@fisiomaritim.com",
    tipo: "oficina",
    direccion: "C/ Reina 122, bajo",
    zona: "Poblats Marítims",
    metros: 140,
    frecuencia: "mensual",
    tarifa: 110,
    acceso: { portero: "Sin portero", llaves: "Cliente abre la puerta", alarma: "Sin alarma", notas: "Desinfección de camillas incluida" },
    cuadrillaId: "cu1",
    activo: true,
    alta: "2026-05-04",
  },
];

const CLIENTES_EM3: ClienteSemilla[] = [
  {
    id: "cl1",
    nombre: "Despacho Uribe Abogados",
    contacto: "Miren Uribe",
    telefono: "944 221 780",
    email: "secretaria@uribeabogados.eus",
    tipo: "oficina",
    direccion: "Gran Vía 42, planta 3",
    zona: "Abando",
    metros: 170,
    frecuencia: "semanal",
    tarifa: 125,
    acceso: { portero: "Recepción del edificio", llaves: "Tarjeta nº 7", alarma: "Alarma central", notas: "Entrar a partir de las 20:00" },
    cuadrillaId: "cu1",
    activo: true,
    alta: "2026-08-12",
  },
  {
    id: "cl2",
    nombre: "Familia Larrea Goikoetxea",
    contacto: "Unai Larrea",
    telefono: "688 512 903",
    email: "unai.larrea@correo.eus",
    tipo: "hogar",
    direccion: "C/ Autonomía 25, 4ºC",
    zona: "Indautxu",
    metros: 112,
    frecuencia: "quincenal",
    tarifa: 78,
    acceso: { portero: "Portera por las mañanas", llaves: "Copia en oficina · llavero 02", alarma: "Sin alarma", notas: "Terraza incluida en verano" },
    cuadrillaId: "cu1",
    activo: true,
    alta: "2026-08-20",
  },
  {
    id: "cl3",
    nombre: "Taberna Getxo Berri",
    contacto: "Aitor Basterra",
    telefono: "946 330 118",
    email: "aitor@getxoberri.eus",
    tipo: "oficina",
    direccion: "Muelle Ereaga 4",
    zona: "Getxo",
    metros: 150,
    frecuencia: "puntual",
    tarifa: 165,
    acceso: { portero: "Sin portero", llaves: "Llave entregada por el encargado", alarma: "Sin alarma", notas: "Limpieza de cocina industrial" },
    cuadrillaId: "cu1",
    activo: true,
    alta: "2026-08-28",
  },
];

/* ---------------- Generación de servicios y facturas ---------------- */

interface PlanServicio {
  id: string;
  clienteId: string;
  cuadrillaId: string;
  offset: number;
  hora: string;
  estado: Servicio["estado"];
  extra?: Partial<Omit<Servicio, "tenantId">>;
}

function construirServicios(
  tenantId: string,
  clientes: ClienteSemilla[],
  plan: PlanServicio[],
): Servicio[] {
  return plan.map((p) => {
    const cliente = clientes.find((c) => c.id === p.clienteId)!;
    const checklist = plantillaChecklist(cliente.tipo).map((t) => ({
      ...t,
      hecha: p.estado === "completado",
    }));
    return {
      id: `${tenantId}-${p.id}`,
      tenantId,
      clienteId: `${tenantId}-${p.clienteId}`,
      cuadrillaId: `${tenantId}-${p.cuadrillaId}`,
      fecha: dias(p.offset),
      hora: p.hora,
      duracion: cliente.tipo === "oficina" ? 3 : 2,
      estado: p.estado,
      checklist,
      importe: cliente.tarifa,
      ...p.extra,
    } as Servicio;
  });
}

function periodoAnterior() {
  const hoy = new Date();
  const m = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
  return `${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, "0")}`;
}

/** Agrupa por cliente los servicios indicados y crea una factura por cliente. */
function construirFacturas(
  tenantId: string,
  servicios: Servicio[],
  ids: string[],
  pagadas: string[],
): Factura[] {
  const periodo = periodoAnterior();
  const porCliente = new Map<string, Servicio[]>();
  ids.forEach((id) => {
    const s = servicios.find((x) => x.id === `${tenantId}-${id}`);
    if (!s) return;
    const lista = porCliente.get(s.clienteId) ?? [];
    lista.push(s);
    porCliente.set(s.clienteId, lista);
  });

  const facturas: Factura[] = [];
  let n = 0;
  porCliente.forEach((lista, clienteId) => {
    n += 1;
    const base = redondear(lista.reduce((t, s) => t + s.importe, 0));
    const iva = redondear(base * 0.21);
    const pagada = pagadas.some((c) => `${tenantId}-${c}` === clienteId);
    const factura: Factura = {
      id: `${tenantId}-f${n}`,
      tenantId,
      numero: `${tenantId.toUpperCase()}-${periodo.replace("-", "")}-${String(n).padStart(3, "0")}`,
      clienteId,
      periodo,
      emision: dias(-20),
      vencimiento: dias(-5 + n),
      servicios: lista.map((s) => s.id),
      base,
      iva,
      total: redondear(base + iva),
      estado: pagada ? "pagada" : "pendiente",
      ...(pagada ? { pagadaEl: dias(-6) } : {}),
    };
    facturas.push(factura);
    lista.forEach((s) => {
      s.facturaId = factura.id;
    });
  });
  return facturas;
}

const PLAN_EM1: PlanServicio[] = [
  { id: "s1", clienteId: "cl1", cuadrillaId: "cu1", offset: -14, hora: "09:00", estado: "completado", extra: { valoracion: { puntuacion: 5, comentario: "Impecable, como siempre.", fecha: dias(-14) } } },
  { id: "s2", clienteId: "cl2", cuadrillaId: "cu1", offset: -12, hora: "19:30", estado: "completado", extra: { valoracion: { puntuacion: 4, comentario: "Muy bien, faltó vaciar una papelera.", fecha: dias(-12) } } },
  { id: "s3", clienteId: "cl3", cuadrillaId: "cu2", offset: -10, hora: "20:00", estado: "completado", extra: { valoracion: { puntuacion: 5, comentario: "Excelente desinfección.", fecha: dias(-10) } } },
  { id: "s4", clienteId: "cl5", cuadrillaId: "cu3", offset: -9, hora: "07:00", estado: "completado", extra: { valoracion: { puntuacion: 4, fecha: dias(-9) } } },
  { id: "s5", clienteId: "cl4", cuadrillaId: "cu2", offset: -7, hora: "15:00", estado: "completado", extra: { valoracion: { puntuacion: 5, comentario: "Muy puntuales.", fecha: dias(-7) } } },
  { id: "s6", clienteId: "cl1", cuadrillaId: "cu1", offset: -7, hora: "09:00", estado: "completado" },
  { id: "s7", clienteId: "cl6", cuadrillaId: "cu3", offset: -5, hora: "08:00", estado: "completado", extra: { valoracion: { puntuacion: 3, comentario: "Se olvidaron los cristales de la terraza.", fecha: dias(-5) } } },
  { id: "s8", clienteId: "cl2", cuadrillaId: "cu1", offset: -4, hora: "19:30", estado: "completado" },
  { id: "s9", clienteId: "cl3", cuadrillaId: "cu2", offset: -3, hora: "20:00", estado: "completado", extra: { valoracion: { puntuacion: 5, fecha: dias(-3) } } },
  { id: "s10", clienteId: "cl5", cuadrillaId: "cu3", offset: -2, hora: "07:00", estado: "completado" },
  { id: "s11", clienteId: "cl1", cuadrillaId: "cu1", offset: 0, hora: "09:00", estado: "en_curso", extra: { notas: "Cliente pide especial atención a la cocina." } },
  { id: "s12", clienteId: "cl2", cuadrillaId: "cu1", offset: 0, hora: "19:30", estado: "pendiente" },
  { id: "s13", clienteId: "cl3", cuadrillaId: "cu2", offset: 0, hora: "20:00", estado: "pendiente" },
  { id: "s14", clienteId: "cl5", cuadrillaId: "cu3", offset: 0, hora: "07:00", estado: "completado" },
  { id: "s15", clienteId: "cl4", cuadrillaId: "cu2", offset: 0, hora: "15:00", estado: "pendiente" },
  { id: "s16", clienteId: "cl6", cuadrillaId: "cu3", offset: 1, hora: "08:00", estado: "pendiente" },
  { id: "s17", clienteId: "cl2", cuadrillaId: "cu1", offset: 2, hora: "19:30", estado: "pendiente" },
  { id: "s18", clienteId: "cl1", cuadrillaId: "cu1", offset: 3, hora: "09:00", estado: "pendiente" },
  { id: "s19", clienteId: "cl7", cuadrillaId: "cu2", offset: 3, hora: "17:00", estado: "pendiente", extra: { notas: "Servicio puntual: limpieza de cristales." } },
  { id: "s20", clienteId: "cl5", cuadrillaId: "cu3", offset: 4, hora: "07:00", estado: "pendiente" },
  { id: "s21", clienteId: "cl3", cuadrillaId: "cu2", offset: 5, hora: "20:00", estado: "pendiente" },
  { id: "s22", clienteId: "cl4", cuadrillaId: "cu2", offset: 6, hora: "15:00", estado: "pendiente" },
];

const PLAN_EM2: PlanServicio[] = [
  { id: "s1", clienteId: "cl1", cuadrillaId: "cu1", offset: -13, hora: "11:00", estado: "completado", extra: { valoracion: { puntuacion: 5, comentario: "Los apartamentos quedaron perfectos.", fecha: dias(-13) } } },
  { id: "s2", clienteId: "cl2", cuadrillaId: "cu1", offset: -11, hora: "20:00", estado: "completado", extra: { valoracion: { puntuacion: 4, fecha: dias(-11) } } },
  { id: "s3", clienteId: "cl4", cuadrillaId: "cu2", offset: -9, hora: "17:00", estado: "completado", extra: { valoracion: { puntuacion: 5, comentario: "Muy cuidadosos con el material infantil.", fecha: dias(-9) } } },
  { id: "s4", clienteId: "cl3", cuadrillaId: "cu2", offset: -8, hora: "16:00", estado: "completado" },
  { id: "s5", clienteId: "cl1", cuadrillaId: "cu1", offset: -6, hora: "11:00", estado: "completado", extra: { valoracion: { puntuacion: 4, comentario: "Buen trabajo, un poco tarde.", fecha: dias(-6) } } },
  { id: "s6", clienteId: "cl2", cuadrillaId: "cu1", offset: -4, hora: "20:00", estado: "completado" },
  { id: "s7", clienteId: "cl5", cuadrillaId: "cu1", offset: -2, hora: "09:00", estado: "completado", extra: { valoracion: { puntuacion: 3, comentario: "Faltó repasar la sala 2.", fecha: dias(-2) } } },
  { id: "s8", clienteId: "cl1", cuadrillaId: "cu1", offset: 0, hora: "11:00", estado: "en_curso" },
  { id: "s9", clienteId: "cl4", cuadrillaId: "cu2", offset: 0, hora: "17:00", estado: "pendiente" },
  { id: "s10", clienteId: "cl2", cuadrillaId: "cu1", offset: 1, hora: "20:00", estado: "pendiente" },
  { id: "s11", clienteId: "cl3", cuadrillaId: "cu2", offset: 2, hora: "16:00", estado: "pendiente", extra: { notas: "Avisar antes de subir, hay gatos." } },
  { id: "s12", clienteId: "cl4", cuadrillaId: "cu2", offset: 4, hora: "17:00", estado: "pendiente" },
  { id: "s13", clienteId: "cl1", cuadrillaId: "cu1", offset: 5, hora: "11:00", estado: "pendiente" },
];

const PLAN_EM3: PlanServicio[] = [
  { id: "s1", clienteId: "cl1", cuadrillaId: "cu1", offset: -6, hora: "20:00", estado: "completado", extra: { valoracion: { puntuacion: 5, comentario: "Primera limpieza y muy contentos.", fecha: dias(-6) } } },
  { id: "s2", clienteId: "cl2", cuadrillaId: "cu1", offset: -4, hora: "09:30", estado: "completado" },
  { id: "s3", clienteId: "cl1", cuadrillaId: "cu1", offset: -1, hora: "20:00", estado: "completado", extra: { valoracion: { puntuacion: 4, fecha: dias(-1) } } },
  { id: "s4", clienteId: "cl3", cuadrillaId: "cu1", offset: 0, hora: "12:00", estado: "pendiente", extra: { notas: "Servicio puntual de cocina industrial." } },
  { id: "s5", clienteId: "cl1", cuadrillaId: "cu1", offset: 2, hora: "20:00", estado: "pendiente" },
  { id: "s6", clienteId: "cl2", cuadrillaId: "cu1", offset: 3, hora: "09:30", estado: "pendiente" },
];

/** Sella el tenant y prefija los ids para que sean únicos entre empresas. */
function conTenant<T extends { id: string; cuadrillaId?: string }>(
  tenantId: string,
  filas: T[],
): (T & { tenantId: string })[] {
  return filas.map((f) => ({
    ...f,
    id: `${tenantId}-${f.id}`,
    ...(f.cuadrillaId ? { cuadrillaId: `${tenantId}-${f.cuadrillaId}` } : {}),
    tenantId,
  }));
}

export function crearDemo(): NitidiaDB {
  const clientes: Cliente[] = [
    ...conTenant("em1", CLIENTES_EM1.map((c) => ({ ...c, acceso: { ...c.acceso } }))),
    ...conTenant("em2", CLIENTES_EM2.map((c) => ({ ...c, acceso: { ...c.acceso } }))),
    ...conTenant("em3", CLIENTES_EM3.map((c) => ({ ...c, acceso: { ...c.acceso } }))),
  ];
  const cuadrillas: Cuadrilla[] = [
    ...conTenant("em1", CUADRILLAS_EM1.map((c) => ({ ...c, integrantes: [...c.integrantes] }))),
    ...conTenant("em2", CUADRILLAS_EM2.map((c) => ({ ...c, integrantes: [...c.integrantes] }))),
    ...conTenant("em3", CUADRILLAS_EM3.map((c) => ({ ...c, integrantes: [...c.integrantes] }))),
  ];

  const serv1 = construirServicios("em1", CLIENTES_EM1, PLAN_EM1);
  const serv2 = construirServicios("em2", CLIENTES_EM2, PLAN_EM2);
  const serv3 = construirServicios("em3", CLIENTES_EM3, PLAN_EM3);

  const fact1 = construirFacturas("em1", serv1, ["s1", "s6", "s2", "s8", "s3", "s9", "s4", "s10", "s5"], ["cl1", "cl2"]);
  const fact2 = construirFacturas("em2", serv2, ["s1", "s5", "s2", "s6", "s3", "s4"], ["cl1"]);
  const fact3 = construirFacturas("em3", serv3, ["s1", "s2"], []);

  return {
    version: 2,
    empresas: EMPRESAS.map((e) => ({ ...e })),
    clientes,
    cuadrillas,
    servicios: [...serv1, ...serv2, ...serv3],
    facturas: [...fact1, ...fact2, ...fact3],
  };
}
