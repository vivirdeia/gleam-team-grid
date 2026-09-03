import { Sparkles, Star } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { EstadoFactura, EstadoServicio, Frecuencia, TipoEspacio } from "@/lib/nitidia/types";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="fondo-suave flex size-9 items-center justify-center rounded-xl text-accent-foreground">
        <Sparkles className="size-5" />
      </span>
      <span className="font-display text-xl font-semibold tracking-tight text-foreground">
        Nitidia
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
