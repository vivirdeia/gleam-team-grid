import type { Factura, NitidiaDB } from "./types";

export const IVA = 0.21;

export function periodoDe(iso: string) {
  return iso.slice(0, 7); // YYYY-MM
}

function redondear(n: number) {
  return Math.round(n * 100) / 100;
}

/**
 * Facturación recurrente: agrupa los servicios completados y no facturados
 * de un periodo (mes) por cliente y genera una factura por cliente.
 */
export function generarFacturasPeriodo(db: NitidiaDB, periodo: string): NitidiaDB {
  const pendientes = db.servicios.filter(
    (s) => s.estado === "completado" && !s.facturaId && periodoDe(s.fecha) === periodo,
  );
  if (pendientes.length === 0) return db;

  const porCliente = new Map<string, typeof pendientes>();
  pendientes.forEach((s) => {
    const lista = porCliente.get(s.clienteId) ?? [];
    lista.push(s);
    porCliente.set(s.clienteId, lista);
  });

  const nuevas: Factura[] = [];
  let contador = db.facturas.filter((f) => f.periodo === periodo).length;
  const emision = new Date();
  const venc = new Date();
  venc.setDate(venc.getDate() + 15);

  porCliente.forEach((servicios, clienteId) => {
    contador += 1;
    const base = redondear(servicios.reduce((t, s) => t + s.importe, 0));
    const iva = redondear(base * IVA);
    const id = `f${periodo.replace("-", "")}${clienteId}`;
    nuevas.push({
      id,
      numero: `NIT-${periodo.replace("-", "")}-${String(contador).padStart(3, "0")}`,
      clienteId,
      periodo,
      emision: emision.toISOString().slice(0, 10),
      vencimiento: venc.toISOString().slice(0, 10),
      servicios: servicios.map((s) => s.id),
      base,
      iva,
      total: redondear(base + iva),
      estado: "pendiente",
    });
  });

  const asignadas = new Map<string, string>();
  nuevas.forEach((f) => f.servicios.forEach((sid) => asignadas.set(sid, f.id)));

  return {
    ...db,
    facturas: [...db.facturas, ...nuevas],
    servicios: db.servicios.map((s) =>
      asignadas.has(s.id) ? { ...s, facturaId: asignadas.get(s.id)! } : s,
    ),
  };
}
