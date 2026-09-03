import { createFileRoute } from "@tanstack/react-router";
import { Clock, MapPin, Users, KeyRound } from "lucide-react";
import { FRECUENCIAS, Pill, TituloSeccion } from "@/components/nitidia/ui";
import { hoyISO, useDB } from "@/lib/nitidia/store";

export const Route = createFileRoute("/app/cuadrillas")({
  head: () => ({
    meta: [
      { title: "Cuadrillas · Nitidia" },
      {
        name: "description",
        content: "Equipos de limpieza con su zona de trabajo, disponibilidad, carga diaria y direcciones asignadas.",
      },
      { property: "og:title", content: "Cuadrillas · Nitidia" },
      { property: "og:description", content: "Zona, disponibilidad y asignación de direcciones por equipo." },
    ],
  }),
  component: Cuadrillas,
});

function Cuadrillas() {
  const db = useDB();
  const hoy = hoyISO();

  return (
    <>
      <TituloSeccion
        titulo="Cuadrillas"
        descripcion="Equipos, zona de trabajo, disponibilidad y direcciones asignadas"
      />

      <div className="grid gap-5 lg:grid-cols-2">
        {db.cuadrillas.map((cu) => {
          const hoyServicios = db.servicios.filter((s) => s.cuadrillaId === cu.id && s.fecha === hoy);
          const pendientes = db.servicios.filter(
            (s) => s.cuadrillaId === cu.id && s.estado !== "completado" && s.fecha >= hoy,
          );
          const direcciones = db.clientes.filter((c) => c.cuadrillaId === cu.id);
          return (
            <article key={cu.id} className="superficie p-6">
              <div className="flex items-start gap-3">
                <span
                  className="flex size-11 shrink-0 items-center justify-center rounded-xl text-white"
                  style={{ backgroundColor: cu.color }}
                >
                  <Users className="size-5" />
                </span>
                <div className="flex-1">
                  <h2 className="font-display text-lg font-semibold">{cu.nombre}</h2>
                  <p className="text-sm text-muted-foreground">Responsable: {cu.responsable}</p>
                </div>
                <Pill tono={cu.activa ? "verde" : "neutro"}>{cu.activa ? "Activa" : "Inactiva"}</Pill>
              </div>

              <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <MapPin className="size-4" /> {cu.zona}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="size-4" /> {cu.disponibilidad}
                </span>
                <span className="flex items-center gap-2">
                  <KeyRound className="size-4" /> PIN demo: {cu.pin}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {cu.integrantes.map((i) => (
                  <Pill key={i}>{i}</Pill>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg bg-muted/60 p-3">
                  <p className="font-display text-xl font-semibold">{hoyServicios.length}</p>
                  <p className="text-xs text-muted-foreground">Hoy</p>
                </div>
                <div className="rounded-lg bg-muted/60 p-3">
                  <p className="font-display text-xl font-semibold">{pendientes.length}</p>
                  <p className="text-xs text-muted-foreground">Pendientes</p>
                </div>
                <div className="rounded-lg bg-muted/60 p-3">
                  <p className="font-display text-xl font-semibold">{direcciones.length}</p>
                  <p className="text-xs text-muted-foreground">Direcciones</p>
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs font-semibold text-foreground">Direcciones asignadas</p>
                <ul className="mt-2 space-y-1.5">
                  {direcciones.length === 0 ? (
                    <li className="text-xs text-muted-foreground">Sin direcciones asignadas.</li>
                  ) : (
                    direcciones.map((c) => (
                      <li key={c.id} className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-medium text-foreground">{c.nombre}</span>
                        <span className="text-muted-foreground">{c.direccion}</span>
                        <Pill>{FRECUENCIAS[c.frecuencia]}</Pill>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
