import { useSyncExternalStore } from "react";
import { crearDemo } from "./seed";
import type { NitidiaDB, Sesion } from "./types";

const CLAVE_DB = "nitidia.db.v1";
const CLAVE_SESION = "nitidia.sesion.v1";

let cacheDB: NitidiaDB | null = null;
let cacheSesion: Sesion | null | undefined = undefined;

const oyentes = new Set<() => void>();
function emitir() {
  oyentes.forEach((f) => f());
}
function suscribir(f: () => void) {
  oyentes.add(f);
  return () => oyentes.delete(f);
}

const hayLS = () => typeof window !== "undefined" && !!window.localStorage;

export function getDB(): NitidiaDB {
  if (cacheDB) return cacheDB;
  if (!hayLS()) {
    cacheDB = crearDemo();
    return cacheDB;
  }
  try {
    const raw = window.localStorage.getItem(CLAVE_DB);
    if (raw) {
      cacheDB = JSON.parse(raw) as NitidiaDB;
      return cacheDB;
    }
  } catch {
    /* datos corruptos: se regenera la demo */
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
