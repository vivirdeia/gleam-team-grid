import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef } from "react";
import { ArrowLeft, Camera, KeyRound, Link2, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { EstadoServicioPill, Estrellas, Pill } from "@/components/nitidia/ui";
import { fechaLarga, setDB, useDB } from "@/lib/nitidia/store";
import type { Servicio } from "@/lib/nitidia/types";

export const Route = createFileRoute("/app/servicio/$id")({
  head: () => ({
    meta: [
      { title: "Checklist del servicio · Nitidia" },
      {
        name: "description",
        content: "Checklist por áreas con fotos, notas y cambio de estado del servicio de limpieza.",
      },
      { property: "og:title", content: "Checklist del servicio · Nitidia" },
      { property: "og:description", content: "Marca tareas, adjunta fotos y cierra el servicio." },
    ],
  }),
  component: DetalleServicio,
});

function DetalleServicio() {
  const { id } = Route.useParams();
  const db = useDB();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const tareaFoto = useRef<string | null>(null);

  const servicio = db.servicios.find((s) => s.id === id);
  if (!servicio) {
    return (
      <div className="superficie p-8 text-center">
        <p className="text-sm text-muted-foreground">Este servicio no existe.</p>
      </div>
    );
  }

  const cliente = db.clientes.find((c) => c.id === servicio.clienteId);
  const cuadrilla = db.cuadrillas.find((c) => c.id === servicio.cuadrillaId);
  const hechas = servicio.checklist.filter((t) => t.hecha).length;
  const pct = Math.round((hechas / servicio.checklist.length) * 100);

  function actualizar(fn: (s: Servicio) => Servicio) {
    setDB((prev) => ({
      ...prev,
      servicios: prev.servicios.map((s) => (s.id === id ? fn(s) : s)),
    }));
  }

  function alternar(tareaId: string) {
    actualizar((s) => ({
      ...s,
      checklist: s.checklist.map((t) => (t.id === tareaId ? { ...t, hecha: !t.hecha } : t)),
      estado: s.estado === "pendiente" ? "en_curso" : s.estado,
    }));
  }

  function pedirFoto(tareaId: string) {
    tareaFoto.current = tareaId;
    fileRef.current?.click();
  }

  function subirFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const tareaId = tareaFoto.current;
    e.target.value = "";
    if (!file || !tareaId) return;
    const reader = new FileReader();
    reader.onload = () => {
      actualizar((s) => ({
        ...s,
        checklist: s.checklist.map((t) =>
          t.id === tareaId ? { ...t, foto: String(reader.result) } : t,
        ),
      }));
      toast.success("Foto adjuntada");
    };
    reader.readAsDataURL(file);
  }

  const areas = Array.from(new Set(servicio.checklist.map((t) => t.area)));

  return (
    <>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={subirFoto} />

      <Link
        to="/app/mis-servicios"
        className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Volver
      </Link>

      <div className="superficie p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-semibold">{cliente?.nombre}</h1>
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="size-4" /> {cliente?.direccion} · {cliente?.zona}
            </p>
            <p className="mt-1 text-sm text-muted-foreground capitalize">
              {fechaLarga(servicio.fecha)} · {servicio.hora} · {cuadrilla?.nombre}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <EstadoServicioPill estado={servicio.estado} />
            <div className="flex gap-2">
              {servicio.estado !== "en_curso" && servicio.estado !== "completado" ? (
                <Button size="sm" onClick={() => actualizar((s) => ({ ...s, estado: "en_curso" }))}>
                  Iniciar servicio
                </Button>
              ) : null}
              {servicio.estado === "en_curso" ? (
                <Button
                  size="sm"
                  onClick={() => {
                    actualizar((s) => ({ ...s, estado: "completado" }));
                    toast.success("Servicio completado");
                  }}
                >
                  Completar servicio
                </Button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progreso del checklist</span>
            <span>
              {hechas}/{servicio.checklist.length} ({pct}%)
            </span>
          </div>
          <div className="mt-1.5 h-2.5 rounded-full bg-muted">
            <div className="h-2.5 rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="space-y-4 lg:col-span-2">
          {areas.map((area) => (
            <div key={area} className="superficie p-5">
              <h2 className="font-display mb-3 text-base font-semibold">{area}</h2>
              <ul className="space-y-2">
                {servicio.checklist
                  .filter((t) => t.area === area)
                  .map((t) => (
                    <li
                      key={t.id}
                      className="flex flex-wrap items-center gap-3 rounded-lg border border-border p-3"
                    >
                      <input
                        type="checkbox"
                        checked={t.hecha}
                        onChange={() => alternar(t.id)}
                        className="size-4 accent-[var(--primary)]"
                        aria-label={t.texto}
                      />
                      <span
                        className={`flex-1 text-sm ${t.hecha ? "text-muted-foreground line-through" : ""}`}
                      >
                        {t.texto}
                      </span>
                      {t.foto ? (
                        <img
                          src={t.foto}
                          alt={`Foto de ${t.texto}`}
                          className="size-10 rounded-md object-cover"
                        />
                      ) : null}
                      <Button size="sm" variant="ghost" onClick={() => pedirFoto(t.id)}>
                        <Camera className="size-4" />
                      </Button>
                    </li>
                  ))}
              </ul>
            </div>
          ))}

          <div className="superficie p-5">
            <h2 className="font-display mb-3 text-base font-semibold">Notas del servicio</h2>
            <Textarea
              rows={3}
              value={servicio.notas ?? ""}
              placeholder="Incidencias, materiales usados, avisos al cliente…"
              onChange={(e) => {
                const v = e.target.value;
                actualizar((s) => ({ ...s, notas: v }));
              }}
            />
          </div>
        </section>

        <aside className="space-y-4">
          <div className="superficie p-5">
            <h2 className="font-display mb-3 flex items-center gap-2 text-base font-semibold">
              <KeyRound className="size-4" /> Datos de acceso
            </h2>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {cliente?.acceso.portero ? <li>Portero: {cliente.acceso.portero}</li> : null}
              {cliente?.acceso.llaves ? <li>Llaves: {cliente.acceso.llaves}</li> : null}
              {cliente?.acceso.alarma ? <li>Alarma: {cliente.acceso.alarma}</li> : null}
              {cliente?.acceso.notas ? <li>Notas: {cliente.acceso.notas}</li> : null}
            </ul>
            <div className="mt-3 flex flex-wrap gap-2">
              <Pill>{cliente?.metros} m²</Pill>
              <Pill>{servicio.duracion} h</Pill>
            </div>
          </div>

          <div className="superficie p-5">
            <h2 className="font-display mb-2 text-base font-semibold">Valoración del cliente</h2>
            {servicio.valoracion ? (
              <>
                <Estrellas valor={servicio.valoracion.puntuacion} tamano={20} />
                {servicio.valoracion.comentario ? (
                  <p className="mt-2 text-sm text-muted-foreground">
                    “{servicio.valoracion.comentario}”
                  </p>
                ) : null}
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  Aún sin valorar. Comparte este enlace con el cliente al completar el servicio.
                </p>
                <Link
                  to="/valorar/$id"
                  params={{ id: servicio.id }}
                  className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <Link2 className="size-4" /> Abrir enlace de valoración
                </Link>
              </>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
