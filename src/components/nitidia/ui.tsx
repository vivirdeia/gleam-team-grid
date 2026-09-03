import { Star } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { EstadoFactura, EstadoServicio, Frecuencia, TipoEspacio } from "@/lib/nitidia/types";

/**
 * Marca Nitidia: monograma geométrico propio.
 * Una "N" construida con dos pilares y una diagonal que se convierte en gota,
 * dentro de un contenedor de esquinas suaves con destello diagonal.
 */
export function Isotipo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      role="img"
      aria-label="Nitidia"
      className={cn("size-9", className)}
    >
      <defs>
        <linearGradient id="nitidia-marca" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.66 0.105 214)" />
          <stop offset="100%" stopColor="oklch(0.7 0.115 172)" />
        </linearGradient>
        <linearGradient id="nitidia-brillo" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="oklch(1 0 0 / 0)" />
          <stop offset="55%" stopColor="oklch(1 0 0 / 0.45)" />
          <stop offset="100%" stopColor="oklch(1 0 0 / 0)" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="40" height="40" rx="13" fill="url(#nitidia-marca)" />
      <path d="M2 30 L30 2 L40 2 L2 40 Z" fill="url(#nitidia-brillo)" />
      {/* Monograma N */}
      <rect x="11" y="10" width="3.6" height="20" rx="1.8" fill="oklch(1 0 0)" />
      <rect x="25.4" y="10" width="3.6" height="20" rx="1.8" fill="oklch(1 0 0 / 0.72)" />
      <path
        d="M12.8 11.2 L27.2 26.4 L27.2 30 L24.6 30 L11 15.4 L11 11.2 Z"
        fill="oklch(1 0 0)"
      />
      {/* Gota de brillo */}
      <path
        d="M30.8 27.2c1.5 1.6 2.4 2.7 2.4 3.8a2.4 2.4 0 1 1-4.8 0c0-1.1.9-2.2 2.4-3.8Z"
        fill="oklch(1 0 0 / 0.9)"
      />
    </svg>
  );
}

export function Logo({
  className,
  tamano = "md",
}: {
  className?: string;
  tamano?: "sm" | "md" | "lg";
}) {
  const marca = { sm: "size-7", md: "size-9", lg: "size-11" }[tamano];
  const texto = { sm: "text-base", md: "text-xl", lg: "text-2xl" }[tamano];
  return (
    <span className={cn("group inline-flex items-center gap-2.5", className)}>
      <Isotipo
        className={cn(marca, "transition-transform duration-500 group-hover:rotate-[-6deg]")}
      />
      <span
        className={cn(
          "font-display font-semibold tracking-[-0.03em] text-foreground",
          texto,
        )}
      >
        Nitid<span className="text-primary">i</span>a
      </span>
    </span>
  );
}

export function Pill({
  children,
  tono = "neutro",
  className,
}: {
  children: ReactNode;
  tono?: "neutro" | "azul" | "verde" | "ambar" | "rojo";
  className?: string;
}) {
  const tonos = {
    neutro: "bg-muted text-muted-foreground",
    azul: "bg-secondary text-secondary-foreground",
    verde: "bg-exito/15 text-exito",
    ambar: "bg-aviso/25 text-aviso-foreground",
    rojo: "bg-destructive/12 text-destructive",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        tonos[tono],
        className,
      )}
    >
      {children}
    </span>
  );
}

const ESTADOS_SERVICIO: Record<EstadoServicio, { texto: string; tono: "neutro" | "azul" | "verde" | "ambar" }> = {
  pendiente: { texto: "Pendiente", tono: "ambar" },
  en_curso: { texto: "En curso", tono: "azul" },
  completado: { texto: "Completado", tono: "verde" },
};

export function EstadoServicioPill({ estado }: { estado: EstadoServicio }) {
  const e = ESTADOS_SERVICIO[estado];
  return <Pill tono={e.tono}>{e.texto}</Pill>;
}

export function EstadoFacturaPill({ estado }: { estado: EstadoFactura }) {
  return estado === "pagada" ? <Pill tono="verde">Pagada</Pill> : <Pill tono="rojo">Pendiente</Pill>;
}

export const FRECUENCIAS: Record<Frecuencia, string> = {
  puntual: "Puntual",
  semanal: "Semanal",
  quincenal: "Quincenal",
  mensual: "Mensual",
};

export const TIPOS: Record<TipoEspacio, string> = {
  hogar: "Hogar",
  oficina: "Oficina",
};

export function Stat({
  etiqueta,
  valor,
  detalle,
  icono,
}: {
  etiqueta: string;
  valor: string;
  detalle?: string;
  icono?: ReactNode;
}) {
  return (
    <div className="superficie p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{etiqueta}</p>
        {icono ? <span className="text-primary">{icono}</span> : null}
      </div>
      <p className="font-display mt-2 text-3xl font-semibold text-foreground">{valor}</p>
      {detalle ? <p className="mt-1 text-xs text-muted-foreground">{detalle}</p> : null}
    </div>
  );
}

export function Estrellas({
  valor,
  onSelect,
  tamano = 16,
}: {
  valor: number;
  onSelect?: (n: number) => void;
  tamano?: number;
}) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) =>
        onSelect ? (
          <button
            key={n}
            type="button"
            aria-label={`${n} estrellas`}
            onClick={() => onSelect(n)}
            className="transition-transform hover:scale-110"
          >
            <Star
              style={{ width: tamano, height: tamano }}
              className={n <= valor ? "fill-aviso text-aviso" : "text-muted-foreground/40"}
            />
          </button>
        ) : (
          <Star
            key={n}
            style={{ width: tamano, height: tamano }}
            className={n <= valor ? "fill-aviso text-aviso" : "text-muted-foreground/30"}
          />
        ),
      )}
    </span>
  );
}

export function TituloSeccion({
  titulo,
  descripcion,
  accion,
}: {
  titulo: string;
  descripcion?: string;
  accion?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">{titulo}</h1>
        {descripcion ? <p className="mt-1 text-sm text-muted-foreground">{descripcion}</p> : null}
      </div>
      {accion}
    </div>
  );
}
