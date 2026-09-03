import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Building2, CalendarCheck, Euro, Star } from "lucide-react";
import {
  EstadoFacturaPill,
  EstadoServicioPill,
  Estrellas,
  Stat,
  TituloSeccion,
} from "@/components/nitidia/ui";
import { euros, fechaCorta, fechaLarga, hoyISO, useTenantDB, useSesion } from "@/lib/nitidia/store";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Panel general · Nitidia" },
      {
        name: "description",
        content: "Vista global de clientes, servicios del día, carga de cuadrillas y facturación pendiente.",
      },
      { property: "og:title", content: "Panel general · Nitidia" },
      { property: "og:description", content: "Resumen diario de la operativa de limpieza." },
    ],
  }),
  component: Panel,
});

function Panel() {
  const sesion = useSesion();
  const navigate = useNavigate();
  useEffect(() => {
    if (sesion?.nivel === "saas") navigate({ to: "/app/saas", replace: true });
  }, [sesion, navigate]);
  const db = useTenantDB();
  const hoy = hoyISO();

  const serviciosHoy = db.servicios
    .filter((s) => s.fecha === hoy)
    .sort((a, b) => a.hora.localeCompare(b.hora));
  const pendienteCobro = db.facturas
    .filter((f) => f.estado === "pendiente")
    .reduce((t, f) => t + f.total, 0);
  const valoraciones = db.servicios.filter((s) => s.valoracion);
  const media =
    valoraciones.length > 0
      ? valoraciones.reduce((t, s) => t + (s.valoracion?.puntuacion ?? 0), 0) / valoraciones.length
      : 0;

  const cliente = (id: string) => db.clientes.find((c) => c.id === id);
  const cuadrilla = (id: string) => db.cuadrillas.find((c) => c.id === id);

  return (
    <>
      <TituloSeccion
        titulo="Panel general"
        descripcion={`Resumen de ${fechaLarga(hoy)}`}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          etiqueta="Clientes activos"
          valor={String(db.clientes.filter((c) => c.activo).length)}
          detalle={`${db.clientes.filter((c) => c.tipo === "hogar").length} hogares · ${db.clientes.filter((c) => c.tipo === "oficina").length} oficinas`}
          icono={<Building2 className="size-5" />}
        />
        <Stat
          etiqueta="Servicios de hoy"
          valor={String(serviciosHoy.length)}
          detalle={`${serviciosHoy.filter((s) => s.estado === "completado").length} completados`}
          icono={<CalendarCheck className="size-5" />}
        />
        <Stat
          etiqueta="Facturación pendiente"
          valor={euros(pendienteCobro)}
          detalle={`${db.facturas.filter((f) => f.estado === "pendiente").length} facturas por cobrar`}
          icono={<Euro className="size-5" />}
        />
        <Stat
          etiqueta="Valoración media"
          valor={media ? media.toFixed(1) : "—"}
          detalle={`${valoraciones.length} valoraciones recibidas`}
          icono={<Star className="size-5" />}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <section className="superficie p-6 lg:col-span-2">
          <h2 className="font-display text-lg font-semibold">Servicios de hoy</h2>
          <div className="mt-4 divide-y divide-border">
            {serviciosHoy.length === 0 ? (
              <p className="py-6 text-sm text-muted-foreground">No hay servicios programados hoy.</p>
            ) : (
              serviciosHoy.map((s) => {
                const c = cliente(s.clienteId);
                const cu = cuadrilla(s.cuadrillaId);
                const hechas = s.checklist.filter((t) => t.hecha).length;
                return (
                  <Link
                    key={s.id}
                    to="/app/servicio/$id"
                    params={{ id: s.id }}
                    className="flex flex-wrap items-center gap-3 py-3 transition-colors hover:bg-muted/40"
                  >
                    <span className="w-14 text-sm font-semibold text-primary">{s.hora}</span>
                    <span className="min-w-48 flex-1">
                      <span className="block text-sm font-medium">{c?.nombre}</span>
                      <span className="block text-xs text-muted-foreground">{c?.direccion}</span>
                    </span>
                    <span className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="size-2 rounded-full" style={{ backgroundColor: cu?.color }} />
                      {cu?.nombre}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {hechas}/{s.checklist.length} tareas
                    </span>
                    <EstadoServicioPill estado={s.estado} />
                  </Link>
                );
              })
            )}
          </div>
        </section>

        <section className="superficie p-6">
          <h2 className="font-display text-lg font-semibold">Carga de cuadrillas</h2>
          <div className="mt-4 space-y-4">
            {db.cuadrillas.map((cu) => {
              const total = db.servicios.filter(
                (s) => s.cuadrillaId === cu.id && s.fecha === hoy,
              ).length;
              const hechos = db.servicios.filter(
                (s) => s.cuadrillaId === cu.id && s.fecha === hoy && s.estado === "completado",
              ).length;
              const pct = total ? Math.round((hechos / total) * 100) : 0;
              return (
                <div key={cu.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium">
                      <span className="size-2.5 rounded-full" style={{ backgroundColor: cu.color }} />
                      {cu.nombre}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {hechos}/{total} hoy
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: cu.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="superficie p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Facturas pendientes</h2>
            <Link to="/app/facturacion" className="text-xs font-medium text-primary hover:underline">
              Ver facturación
            </Link>
          </div>
          <div className="mt-4 divide-y divide-border">
            {db.facturas
              .filter((f) => f.estado === "pendiente")
              .map((f) => (
                <div key={f.id} className="flex items-center gap-3 py-3">
                  <span className="flex-1">
                    <span className="block text-sm font-medium">{cliente(f.clienteId)?.nombre}</span>
                    <span className="block text-xs text-muted-foreground">
                      {f.numero} · vence {fechaCorta(f.vencimiento)}
                    </span>
                  </span>
                  <span className="text-sm font-semibold">{euros(f.total)}</span>
                  <EstadoFacturaPill estado={f.estado} />
                </div>
              ))}
          </div>
        </section>

        <section className="superficie p-6">
          <h2 className="font-display text-lg font-semibold">Últimas valoraciones</h2>
          <div className="mt-4 divide-y divide-border">
            {valoraciones
              .slice()
              .sort((a, b) => (b.valoracion!.fecha > a.valoracion!.fecha ? 1 : -1))
              .slice(0, 5)
              .map((s) => (
                <div key={s.id} className="py-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">{cliente(s.clienteId)?.nombre}</span>
                    <Estrellas valor={s.valoracion!.puntuacion} />
                  </div>
                  {s.valoracion?.comentario ? (
                    <p className="mt-1 text-xs text-muted-foreground">“{s.valoracion.comentario}”</p>
                  ) : null}
                </div>
              ))}
          </div>
        </section>
      </div>
    </>
  );
}
