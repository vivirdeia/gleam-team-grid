import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, KeyRound, MapPin } from "lucide-react";
import { EstadoServicioPill, Pill, TituloSeccion } from "@/components/nitidia/ui";
import { fechaLarga, hoyISO, useDB, useSesion } from "@/lib/nitidia/store";
import type { Servicio } from "@/lib/nitidia/types";

export const Route = createFileRoute("/app/mis-servicios")({
  head: () => ({
    meta: [
      { title: "Mis servicios · Nitidia" },
      {
        name: "description",
        content: "Servicios asignados a tu cuadrilla, con datos de acceso y progreso del checklist.",
      },
      { property: "og:title", content: "Mis servicios · Nitidia" },
      { property: "og:description", content: "Ruta del día para la cuadrilla, con accesos y checklist." },
    ],
  }),
  component: MisServicios,
});

function MisServicios() {
  const db = useDB();
  const sesion = useSesion();
  const hoy = hoyISO();

  const cuadrillaId =
    sesion?.nivel === "tenant" && sesion.rol === "cuadrilla"
      ? (sesion.cuadrillaId ?? "")
      : (db.cuadrillas[0]?.id ?? "");
  const cuadrilla = db.cuadrillas.find((c) => c.id === cuadrillaId);

  const mios = db.servicios.filter((s) => s.cuadrillaId === cuadrillaId);
  const deHoy = mios.filter((s) => s.fecha === hoy).sort((a, b) => a.hora.localeCompare(b.hora));
  const proximos = mios
    .filter((s) => s.fecha > hoy)
    .sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora))
    .slice(0, 8);

  return (
    <>
      <TituloSeccion
        titulo={cuadrilla ? cuadrilla.nombre : "Mis servicios"}
        descripcion={`Ruta de ${fechaLarga(hoy)} · ${cuadrilla?.zona ?? ""}`}
      />

      <section>
        <h2 className="font-display mb-3 text-lg font-semibold">Hoy</h2>
        {deHoy.length === 0 ? (
          <p className="superficie p-6 text-sm text-muted-foreground">
            No tienes servicios asignados hoy.
          </p>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {deHoy.map((s) => (
              <TarjetaServicio key={s.id} servicio={s} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="font-display mb-3 flex items-center gap-2 text-lg font-semibold">
          <CalendarDays className="size-5 text-primary" /> Próximos servicios
        </h2>
        <div className="superficie divide-y divide-border">
          {proximos.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">Sin servicios próximos.</p>
          ) : (
            proximos.map((s) => {
              const c = db.clientes.find((x) => x.id === s.clienteId);
              return (
                <Link
                  key={s.id}
                  to="/app/servicio/$id"
                  params={{ id: s.id }}
                  className="flex flex-wrap items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/40"
                >
                  <span className="w-40 text-sm text-muted-foreground capitalize">
                    {fechaLarga(s.fecha)}
                  </span>
                  <span className="w-14 text-sm font-semibold text-primary">{s.hora}</span>
                  <span className="min-w-40 flex-1 text-sm font-medium">{c?.nombre}</span>
                  <EstadoServicioPill estado={s.estado} />
                </Link>
              );
            })
          )}
        </div>
      </section>
    </>
  );
}

function TarjetaServicio({ servicio }: { servicio: Servicio }) {
  const db = useDB();
  const c = db.clientes.find((x) => x.id === servicio.clienteId);
  const hechas = servicio.checklist.filter((t) => t.hecha).length;
  const pct = Math.round((hechas / servicio.checklist.length) * 100);

  return (
    <Link
      to="/app/servicio/$id"
      params={{ id: servicio.id }}
      className="superficie block p-5 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-primary">{servicio.hora}</p>
          <h3 className="font-display text-base font-semibold">{c?.nombre}</h3>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-3.5" /> {c?.direccion}
          </p>
        </div>
        <EstadoServicioPill estado={servicio.estado} />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Pill>{servicio.duracion} h estimadas</Pill>
        {c ? <Pill tono="azul">{c.tipo === "hogar" ? "Hogar" : "Oficina"}</Pill> : null}
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Checklist</span>
          <span>
            {hechas}/{servicio.checklist.length}
          </span>
        </div>
        <div className="mt-1.5 h-2 rounded-full bg-muted">
          <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {c ? (
        <p className="mt-3 flex items-start gap-2 rounded-lg bg-muted/60 p-2 text-xs text-muted-foreground">
          <KeyRound className="mt-0.5 size-3.5 shrink-0" />
          {[c.acceso.portero, c.acceso.llaves, c.acceso.alarma].filter(Boolean).join(" · ")}
        </p>
      ) : null}
    </Link>
  );
}
