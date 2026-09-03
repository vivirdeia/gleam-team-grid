import { useSyncExternalStore } from "react";
import { crearDemo } from "./seed";
import type { Empresa, NitidiaDB, Sesion, TenantDB } from "./types";

const CLAVE_DB = "nitidia.db.v2";
const CLAVE_SESION = "nitidia.sesion.v2";

let cacheDB: NitidiaDB | null = null;
let cacheSesion: Sesion | null | undefined = undefined;
let cacheTenantDB: { tenantId: string; db: NitidiaDB; vista: TenantDB } | null = null;

const oyentes = new Set<() => void>();
function emitir() {
  oyentes.forEach((f) => f());
}
function suscribir(f: () => void) {
  oyentes.add(f);
  return () => oyentes.delete(f);
}

const hayLS = () => typeof window !== "undefined" && !!window.localStorage;

/* ---------- base global (solo super admin del SaaS) ---------- */

export function getDB(): NitidiaDB {
  if (cacheDB) return cacheDB;
  if (!hayLS()) {
    cacheDB = crearDemo();
    return cacheDB;
  }
  try {
    const raw = window.localStorage.getItem(CLAVE_DB);
    if (raw) {
      const parsed = JSON.parse(raw) as NitidiaDB;
      if (parsed.version === 2 && Array.isArray(parsed.empresas)) {
        cacheDB = parsed;
        return cacheDB;
      }
    }
  } catch {
    /* datos corruptos o de una versión antigua: se regenera la demo */
  }
  cacheDB = crearDemo();
  window.localStorage.setItem(CLAVE_DB, JSON.stringify(cacheDB));
  return cacheDB;
}

export function setDB(actualizar: (db: NitidiaDB) => NitidiaDB) {
  const siguiente = actualizar(getDB());
  cacheDB = siguiente;
  if (hayLS()) window.localStorage.setItem(CLAVE_DB, JSON.stringify(siguiente));
  emitir();
}

export function resetDemo() {
  cacheDB = crearDemo();
  if (hayLS()) window.localStorage.setItem(CLAVE_DB, JSON.stringify(cacheDB));
  emitir();
}

const dbServidor = crearDemo();
export function useDB(): NitidiaDB {
  return useSyncExternalStore(
    suscribir,
    () => getDB(),
    () => dbServidor,
  );
}

/* ---------- acotado al tenant ---------- */

export function getEmpresa(tenantId: string): Empresa | undefined {
  return getDB().empresas.find((e) => e.id === tenantId);
}

export function getTenantDB(tenantId: string): TenantDB {
  const db = getDB();
  if (cacheTenantDB && cacheTenantDB.tenantId === tenantId && cacheTenantDB.db === db) {
    return cacheTenantDB.vista;
  }
  const empresa =
    db.empresas.find((e) => e.id === tenantId) ??
    ({ id: tenantId, nombre: "Empresa", slug: tenantId, emailContacto: "", plan: "prueba", alta: "", activo: false } as Empresa);
  const vista: TenantDB = {
    empresa,
    clientes: db.clientes.filter((c) => c.tenantId === tenantId),
    cuadrillas: db.cuadrillas.filter((c) => c.tenantId === tenantId),
    servicios: db.servicios.filter((s) => s.tenantId === tenantId),
    facturas: db.facturas.filter((f) => f.tenantId === tenantId),
  };
  cacheTenantDB = { tenantId, db, vista };
  return vista;
}

/** Escritura acotada: la función recibe y devuelve SOLO los datos del tenant. */
export function setTenantDB(
  tenantId: string,
  actualizar: (vista: TenantDB) => Partial<Omit<TenantDB, "empresa">> & { empresa?: Empresa },
) {
  setDB((db) => {
    const vista = getTenantDB(tenantId);
    const cambios = actualizar(vista);
    const fuera = <T extends { tenantId: string }>(filas: T[]) =>
      filas.filter((f) => f.tenantId !== tenantId);
    const sello = <T extends { tenantId: string }>(filas: T[]) =>
      filas.map((f) => (f.tenantId === tenantId ? f : { ...f, tenantId }));

    return {
      ...db,
      empresas: cambios.empresa
        ? db.empresas.map((e) => (e.id === tenantId ? cambios.empresa! : e))
        : db.empresas,
      clientes: cambios.clientes ? [...fuera(db.clientes), ...sello(cambios.clientes)] : db.clientes,
      cuadrillas: cambios.cuadrillas
        ? [...fuera(db.cuadrillas), ...sello(cambios.cuadrillas)]
        : db.cuadrillas,
      servicios: cambios.servicios
        ? [...fuera(db.servicios), ...sello(cambios.servicios)]
        : db.servicios,
      facturas: cambios.facturas ? [...fuera(db.facturas), ...sello(cambios.facturas)] : db.facturas,
    };
  });
}

/** Vista reactiva del tenant activo (o el indicado). */
export function useTenantDB(tenantId?: string): TenantDB {
  const sesion = useSesion();
  const id = tenantId ?? (sesion?.nivel === "tenant" ? sesion.tenantId : (getDB().empresas[0]?.id ?? ""));
  const db = useDB();
  void db; // fuerza re-render al cambiar la base
  return getTenantDB(id);
}

/** Id del tenant activo según la sesión (null para el super admin del SaaS). */
export function tenantActivo(sesion: Sesion | null): string | null {
  return sesion?.nivel === "tenant" ? sesion.tenantId : null;
}

/* ---------- sesión ---------- */

export function getSesion(): Sesion | null {
  if (cacheSesion !== undefined) return cacheSesion;
  if (!hayLS()) return null;
  try {
    const raw = window.localStorage.getItem(CLAVE_SESION);
    cacheSesion = raw ? (JSON.parse(raw) as Sesion) : null;
  } catch {
    cacheSesion = null;
  }
  return cacheSesion;
}

export function setSesion(s: Sesion | null) {
  cacheSesion = s;
  if (hayLS()) {
    if (s) window.localStorage.setItem(CLAVE_SESION, JSON.stringify(s));
    else window.localStorage.removeItem(CLAVE_SESION);
  }
  emitir();
}

export function useSesion(): Sesion | null {
  return useSyncExternalStore(
    suscribir,
    () => getSesion(),
    () => null,
  );
}

/* ---------- helpers ---------- */

export function hoyISO() {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

export function euros(n: number) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n);
}

export function fechaLarga(iso: string) {
  const [a = 2026, m = 1, d = 1] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "numeric", month: "long" }).format(
    new Date(a, m - 1, d),
  );
}

export function fechaCorta(iso: string) {
  const [a = 2026, m = 1, d = 1] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" }).format(
    new Date(a, m - 1, d),
  );
}

export function nuevoId(prefijo: string) {
  return `${prefijo}${Math.random().toString(36).slice(2, 8)}`;
}

export function inicioSemana(base: Date) {
  const d = new Date(base);
  d.setHours(12, 0, 0, 0);
  const dia = (d.getDay() + 6) % 7; // lunes = 0
  d.setDate(d.getDate() - dia);
  return d;
}

export function isoDe(d: Date) {
  const c = new Date(d);
  c.setHours(12, 0, 0, 0);
  return c.toISOString().slice(0, 10);
}
