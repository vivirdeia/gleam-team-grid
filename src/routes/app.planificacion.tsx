import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarPlus, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EstadoServicioPill, TituloSeccion } from "@/components/nitidia/ui";
import { plantillaChecklist } from "@/lib/nitidia/seed";
import { hoyISO, inicioSemana, isoDe, nuevoId, setDB, useDB } from "@/lib/nitidia/store";
import type { Servicio } from "@/lib/nitidia/types";

export const Route = createFileRoute("/app/planificacion")({
  head: () => ({
    meta: [
      { title: "Planificación de servicios · Nitidia" },
      {
        name: "description",
        content: "Calendario semanal de servicios asignados a cada cuadrilla con su estado en tiempo real.",
      },
      { property: "og:title", content: "Planificación de servicios · Nitidia" },
      { property: "og:description", content: "Calendario semanal por cuadrilla y estado del servicio." },
    ],
  }),
  component: Planificacion,
});

const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

function Planificacion() {
  const db = useDB();
  const hoy = hoyISO();
  const [offset, setOffset] = useState(0);
  const [abierto, setAbierto] = useState(false);
  const [form, setForm] = useState({
    clienteId: db.clientes[0]?.id ?? "",
    cuadrillaId: db.cuadrillas[0]?.id ?? "",
    fecha: hoy,
    hora: "09:00",
    notas: "",
  });

  const base = new Date();
  base.setDate(base.getDate() + offset * 7);
  const lunes = inicioSemana(base);
  const dias = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(lunes);
    d.setDate(d.getDate() + i);
    return isoDe(d);
  });

  function crearServicio() {
    const cliente = db.clientes.find((c) => c.id === form.clienteId);
    if (!cliente) {
      toast.error("Selecciona un cliente");
      return;
    }
    const servicio: Servicio = {
      id: nuevoId("s"),
      clienteId: cliente.id,
      cuadrillaId: form.cuadrillaId,
      fecha: form.fecha,
      hora: form.hora,
      duracion: cliente.tipo === "oficina" ? 3 : 2,
      estado: "pendiente",
      checklist: plantillaChecklist(cliente.tipo),
      importe: cliente.tarifa,
      ...(form.notas.trim() ? { notas: form.notas.trim() } : {}),
    };
    setDB((prev) => ({ ...prev, servicios: [...prev.servicios, servicio] }));
    setAbierto(false);
    setForm({ ...form, notas: "" });
    toast.success("Servicio planificado");
  }

  return (
    <>
      <TituloSeccion
        titulo="Planificación"
        descripcion="Calendario semanal de servicios por cuadrilla"
        accion={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setOffset(offset - 1)}>
              <ChevronLeft className="size-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setOffset(0)}>
              Hoy
            </Button>
            <Button variant="outline" size="icon" onClick={() => setOffset(offset + 1)}>
              <ChevronRight className="size-4" />
            </Button>
            <Dialog open={abierto} onOpenChange={setAbierto}>
              <DialogTrigger asChild>
                <Button>
                  <CalendarPlus className="size-4" /> Nuevo servicio
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Planificar servicio</DialogTitle>
                  <DialogDescription>
                    El checklist se genera automáticamente según el tipo de espacio.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label>Cliente</Label>
                    <select
                      className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                      value={form.clienteId}
                      onChange={(e) => setForm({ ...form, clienteId: e.target.value })}
                    >
                      {db.clientes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nombre} — {c.direccion}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Cuadrilla</Label>
                    <select
                      className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                      value={form.cuadrillaId}
                      onChange={(e) => setForm({ ...form, cuadrillaId: e.target.value })}
                    >
                      {db.cuadrillas.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Fecha</Label>
                      <Input
                        type="date"
                        value={form.fecha}
                        onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Hora</Label>
                      <Input
                        type="time"
                        value={form.hora}
                        onChange={(e) => setForm({ ...form, hora: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Notas</Label>
                    <Textarea
                      rows={2}
                      value={form.notas}
                      onChange={(e) => setForm({ ...form, notas: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAbierto(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={crearServicio}>Planificar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      <div className="grid gap-3 lg:grid-cols-7">
        {dias.map((fecha, i) => {
          const delDia = db.servicios
            .filter((s) => s.fecha === fecha)
            .sort((a, b) => a.hora.localeCompare(b.hora));
          const esHoy = fecha === hoy;
          return (
            <div
              key={fecha}
              className={`superficie flex min-h-44 flex-col p-3 ${esHoy ? "ring-2 ring-primary/40" : ""}`}
            >
              <div className="mb-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase">{DIAS[i]}</p>
                <p className="font-display text-lg font-semibold">{Number(fecha.slice(8, 10))}</p>
              </div>
              <div className="flex-1 space-y-2">
                {delDia.length === 0 ? (
                  <p className="text-xs text-muted-foreground">Sin servicios</p>
                ) : (
                  delDia.map((s) => {
                    const c = db.clientes.find((x) => x.id === s.clienteId);
                    const cu = db.cuadrillas.find((x) => x.id === s.cuadrillaId);
                    return (
                      <Link
                        key={s.id}
                        to="/app/servicio/$id"
                        params={{ id: s.id }}
                        className="block rounded-lg border border-border bg-card p-2 transition-colors hover:bg-muted/60"
                        style={{ borderLeft: `3px solid ${cu?.color ?? "var(--primary)"}` }}
                      >
                        <p className="text-xs font-semibold text-primary">{s.hora}</p>
                        <p className="truncate text-xs font-medium">{c?.nombre}</p>
                        <p className="truncate text-[11px] text-muted-foreground">{cu?.nombre}</p>
                        <div className="mt-1">
                          <EstadoServicioPill estado={s.estado} />
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
