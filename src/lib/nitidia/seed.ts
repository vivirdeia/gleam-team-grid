import type {
  Cliente,
  Cuadrilla,
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

const CUADRILLAS: Cuadrilla[] = [
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

const CLIENTES: Cliente[] = [
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

function servicio(
  id: string,
  clienteId: string,
  cuadrillaId: string,
  fecha: string,
  hora: string,
  estado: Servicio["estado"],
  extra: Partial<Servicio> = {},
): Servicio {
  const cliente = CLIENTES.find((c) => c.id === clienteId)!;
  const checklist = plantillaChecklist(cliente.tipo).map((t) => ({
    ...t,
    hecha: estado === "completado",
  }));
  return {
    id,
    clienteId,
    cuadrillaId,
    fecha,
    hora,
    duracion: cliente.tipo === "oficina" ? 3 : 2,
    estado,
    checklist,
    importe: cliente.tarifa,
    ...extra,
  };
}

export function crearDemo(): NitidiaDB {
  const servicios: Servicio[] = [
    // Pasado (completados y valorados)
    servicio("s1", "cl1", "cu1", dias(-14), "09:00", "completado", {
      valoracion: { puntuacion: 5, comentario: "Impecable, como siempre.", fecha: dias(-14) },
    }),
    servicio("s2", "cl2", "cu1", dias(-12), "19:30", "completado", {
      valoracion: { puntuacion: 4, comentario: "Muy bien, faltó vaciar una papelera.", fecha: dias(-12) },
    }),
    servicio("s3", "cl3", "cu2", dias(-10), "20:00", "completado", {
      valoracion: { puntuacion: 5, comentario: "Excelente desinfección.", fecha: dias(-10) },
    }),
    servicio("s4", "cl5", "cu3", dias(-9), "07:00", "completado", {
      valoracion: { puntuacion: 4, fecha: dias(-9) },
    }),
    servicio("s5", "cl4", "cu2", dias(-7), "15:00", "completado", {
      valoracion: { puntuacion: 5, comentario: "Muy puntuales.", fecha: dias(-7) },
    }),
    servicio("s6", "cl1", "cu1", dias(-7), "09:00", "completado"),
    servicio("s7", "cl6", "cu3", dias(-5), "08:00", "completado", {
      valoracion: { puntuacion: 3, comentario: "Se olvidaron los cristales de la terraza.", fecha: dias(-5) },
    }),
    servicio("s8", "cl2", "cu1", dias(-4), "19:30", "completado"),
    servicio("s9", "cl3", "cu2", dias(-3), "20:00", "completado", {
      valoracion: { puntuacion: 5, fecha: dias(-3) },
    }),
    servicio("s10", "cl5", "cu3", dias(-2), "07:00", "completado"),

    // Hoy
    servicio("s11", "cl1", "cu1", dias(0), "09:00", "en_curso", { notas: "Cliente pide especial atención a la cocina." }),
    servicio("s12", "cl2", "cu1", dias(0), "19:30", "pendiente"),
    servicio("s13", "cl3", "cu2", dias(0), "20:00", "pendiente"),
    servicio("s14", "cl5", "cu3", dias(0), "07:00", "completado"),
    servicio("s15", "cl4", "cu2", dias(0), "15:00", "pendiente"),

    // Próximos días
    servicio("s16", "cl6", "cu3", dias(1), "08:00", "pendiente"),
    servicio("s17", "cl2", "cu1", dias(2), "19:30", "pendiente"),
    servicio("s18", "cl1", "cu1", dias(3), "09:00", "pendiente"),
    servicio("s19", "cl7", "cu2", dias(3), "17:00", "pendiente", { notas: "Servicio puntual: limpieza de cristales." }),
    servicio("s20", "cl5", "cu3", dias(4), "07:00", "pendiente"),
    servicio("s21", "cl3", "cu2", dias(5), "20:00", "pendiente"),
    servicio("s22", "cl4", "cu2", dias(6), "15:00", "pendiente"),
  ];

  const hoy = new Date();
  const mesAnterior = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
  const periodoAnt = `${mesAnterior.getFullYear()}-${String(mesAnterior.getMonth() + 1).padStart(2, "0")}`;

  const facturas: Factura[] = [
    {
      id: "f1",
      numero: `NIT-${periodoAnt.replace("-", "")}-001`,
      clienteId: "cl1",
      periodo: periodoAnt,
      emision: dias(-20),
      vencimiento: dias(-5),
      servicios: ["s1", "s6"],
      base: 136,
      iva: 28.56,
      total: 164.56,
      estado: "pagada",
      pagadaEl: dias(-8),
    },
    {
      id: "f2",
      numero: `NIT-${periodoAnt.replace("-", "")}-002`,
      clienteId: "cl2",
      periodo: periodoAnt,
      emision: dias(-20),
      vencimiento: dias(-5),
      servicios: ["s2", "s8"],
      base: 290,
      iva: 60.9,
      total: 350.9,
      estado: "pagada",
      pagadaEl: dias(-6),
    },
    {
      id: "f3",
      numero: `NIT-${periodoAnt.replace("-", "")}-003`,
      clienteId: "cl3",
      periodo: periodoAnt,
      emision: dias(-18),
      vencimiento: dias(-3),
      servicios: ["s3", "s9"],
      base: 240,
      iva: 50.4,
      total: 290.4,
      estado: "pendiente",
    },
    {
      id: "f4",
      numero: `NIT-${periodoAnt.replace("-", "")}-004`,
      clienteId: "cl5",
      periodo: periodoAnt,
      emision: dias(-18),
      vencimiento: dias(2),
      servicios: ["s4", "s10"],
      base: 420,
      iva: 88.2,
      total: 508.2,
      estado: "pendiente",
    },
    {
      id: "f5",
      numero: `NIT-${periodoAnt.replace("-", "")}-005`,
      clienteId: "cl4",
      periodo: periodoAnt,
      emision: dias(-15),
      vencimiento: dias(0),
      servicios: ["s5"],
      base: 82,
      iva: 17.22,
      total: 99.22,
      estado: "pendiente",
    },
  ];

  servicios.forEach((s) => {
    const f = facturas.find((x) => x.servicios.includes(s.id));
    if (f) s.facturaId = f.id;
  });

  return {
    version: 1,
    clientes: CLIENTES.map((c) => ({ ...c, acceso: { ...c.acceso } })),
    cuadrillas: CUADRILLAS.map((c) => ({ ...c, integrantes: [...c.integrantes] })),
    servicios,
    facturas,
  };
}
