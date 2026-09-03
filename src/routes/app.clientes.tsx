import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Building2, Home, KeyRound, Plus, Search, ShieldAlert, Phone, Mail } from "lucide-react";
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
import { FRECUENCIAS, Pill, TIPOS, TituloSeccion } from "@/components/nitidia/ui";
import { euros, hoyISO, nuevoId, setTenantDB, useTenantDB } from "@/lib/nitidia/store";
import { PLANES } from "@/lib/nitidia/types";
import type { Cliente, Frecuencia, TipoEspacio } from "@/lib/nitidia/types";

export const Route = createFileRoute("/app/clientes")({
  head: () => ({
    meta: [
      { title: "Clientes y direcciones · Nitidia" },
      {
        name: "description",
        content: "Gestiona clientes de hogar y oficina, sus datos de acceso y la frecuencia contratada.",
      },
      { property: "og:title", content: "Clientes y direcciones · Nitidia" },
      { property: "og:description", content: "Direcciones, accesos, frecuencia y cuadrilla asignada." },
    ],
  }),
  component: Clientes,
});

const FORM_INICIAL = {
  nombre: "",
  contacto: "",
  telefono: "",
  email: "",
  tipo: "hogar" as TipoEspacio,
  direccion: "",
  zona: "",
  metros: "80",
  frecuencia: "semanal" as Frecuencia,
  tarifa: "70",
  cuadrillaId: "",
  portero: "",
  llaves: "",
  alarma: "",
  notas: "",
};

function Clientes() {
  const db = useTenantDB();
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState<"todos" | TipoEspacio>("todos");
  const [abierto, setAbierto] = useState(false);
  const [form, setForm] = useState(FORM_INICIAL);
  const plan = PLANES[db.empresa.plan];
  const limitePlan = plan.limiteClientes;
  const limiteAlcanzado = db.clientes.length >= limitePlan;

  const lista = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return db.clientes.filter((c) => {
      const coincide =
        !q ||
        [c.nombre, c.direccion, c.zona, c.contacto].some((v) => v.toLowerCase().includes(q));
      return coincide && (filtro === "todos" || c.tipo === filtro);
    });
  }, [db.clientes, busqueda, filtro]);

  function crear() {
    if (!form.nombre.trim() || !form.direccion.trim()) {
      toast.error("Indica al menos nombre y dirección");
      return;
    }
    if (db.clientes.length >= limitePlan) {
      toast.error(
        `Has alcanzado el límite de tu plan ${plan.etiqueta}: ${limitePlan} clientes. Mejora de plan para añadir más.`,
      );
      return;
    }

    const cliente: Cliente = {
      id: nuevoId("cl"),
      tenantId: db.empresa.id,
      nombre: form.nombre.trim(),
      contacto: form.contacto.trim() || form.nombre.trim(),
      telefono: form.telefono.trim(),
      email: form.email.trim(),
      tipo: form.tipo,
      direccion: form.direccion.trim(),
      zona: form.zona.trim() || "Sin zona",
      metros: Number(form.metros) || 0,
      frecuencia: form.frecuencia,
      tarifa: Number(form.tarifa) || 0,
      acceso: {
        portero: form.portero.trim(),
        llaves: form.llaves.trim(),
        alarma: form.alarma.trim(),
        notas: form.notas.trim(),
      },
      ...(form.cuadrillaId ? { cuadrillaId: form.cuadrillaId } : {}),
      activo: true,
      alta: hoyISO(),
    };
    setTenantDB(db.empresa.id, (v) => ({ clientes: [cliente, ...v.clientes] }));
    setForm(FORM_INICIAL);
    setAbierto(false);
    toast.success("Cliente creado");
  }

  return (
    <>
      <TituloSeccion
        titulo="Clientes y direcciones"
        descripcion="Hogares y oficinas con sus datos de acceso y frecuencia contratada"
        accion={
          <Dialog open={abierto} onOpenChange={setAbierto}>
            <DialogTrigger asChild>
              <Button disabled={limiteAlcanzado}>
                <Plus className="size-4" /> Nuevo cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Nuevo cliente</DialogTitle>
                <DialogDescription>
                  Los datos se guardan en el navegador (demo sin backend).
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 sm:grid-cols-2">
                <Campo label="Nombre" valor={form.nombre} set={(v) => setForm({ ...form, nombre: v })} />
                <Campo label="Persona de contacto" valor={form.contacto} set={(v) => setForm({ ...form, contacto: v })} />
                <Campo label="Teléfono" valor={form.telefono} set={(v) => setForm({ ...form, telefono: v })} />
                <Campo label="Email" valor={form.email} set={(v) => setForm({ ...form, email: v })} />
                <div className="space-y-2">
                  <Label>Tipo de espacio</Label>
                  <select
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                    value={form.tipo}
                    onChange={(e) => setForm({ ...form, tipo: e.target.value as TipoEspacio })}
                  >
                    <option value="hogar">Hogar</option>
                    <option value="oficina">Oficina</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Frecuencia contratada</Label>
                  <select
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                    value={form.frecuencia}
                    onChange={(e) => setForm({ ...form, frecuencia: e.target.value as Frecuencia })}
                  >
                    {Object.entries(FRECUENCIAS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
                <Campo label="Dirección" valor={form.direccion} set={(v) => setForm({ ...form, direccion: v })} />
                <Campo label="Zona" valor={form.zona} set={(v) => setForm({ ...form, zona: v })} />
                <Campo label="Metros²" valor={form.metros} set={(v) => setForm({ ...form, metros: v })} />
                <Campo label="Tarifa por servicio (€)" valor={form.tarifa} set={(v) => setForm({ ...form, tarifa: v })} />
                <div className="space-y-2 sm:col-span-2">
                  <Label>Cuadrilla asignada</Label>
                  <select
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                    value={form.cuadrillaId}
                    onChange={(e) => setForm({ ...form, cuadrillaId: e.target.value })}
                  >
                    <option value="">Sin asignar</option>
                    {db.cuadrillas.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <Campo label="Portero / recepción" valor={form.portero} set={(v) => setForm({ ...form, portero: v })} />
                <Campo label="Llaves" valor={form.llaves} set={(v) => setForm({ ...form, llaves: v })} />
                <Campo label="Alarma" valor={form.alarma} set={(v) => setForm({ ...form, alarma: v })} />
                <div className="space-y-2 sm:col-span-2">
                  <Label>Notas de acceso</Label>
                  <Textarea
                    value={form.notas}
                    onChange={(e) => setForm({ ...form, notas: e.target.value })}
                    rows={2}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAbierto(false)}>
                  Cancelar
                </Button>
                <Button onClick={crear}>Guardar cliente</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {limiteAlcanzado ? (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-300/60 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
          <ShieldAlert className="mt-0.5 size-4 shrink-0" />
          <p>
            Has alcanzado el límite de tu plan {plan.etiqueta}: {limitePlan} clientes. Mejora de plan
            para añadir más.
          </p>
        </div>
      ) : (
        <p className="mb-4 text-xs text-muted-foreground">
          Plan {plan.etiqueta} · {db.clientes.length} de {limitePlan} clientes usados
        </p>
      )}

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-64 flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Buscar por nombre, dirección o zona…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="flex gap-1 rounded-lg border border-border bg-card p-1">
          {(["todos", "hogar", "oficina"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFiltro(t)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                filtro === t ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {t === "todos" ? "Todos" : TIPOS[t]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {lista.map((c) => {
          const cu = db.cuadrillas.find((x) => x.id === c.cuadrillaId);
          const Icono = c.tipo === "hogar" ? Home : Building2;
          return (
            <article key={c.id} className="superficie p-5">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icono className="size-5" />
                </span>
                <div className="flex-1">
                  <h2 className="font-display text-base font-semibold">{c.nombre}</h2>
                  <p className="text-sm text-muted-foreground">
                    {c.direccion} · {c.zona}
                  </p>
                </div>
                <Pill tono={c.tipo === "hogar" ? "verde" : "azul"}>{TIPOS[c.tipo]}</Pill>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <Pill>{FRECUENCIAS[c.frecuencia]}</Pill>
                <Pill>{c.metros} m²</Pill>
                <Pill>{euros(c.tarifa)} / servicio</Pill>
                {cu ? <Pill tono="azul">{cu.nombre}</Pill> : <Pill tono="ambar">Sin cuadrilla</Pill>}
              </div>

              <div className="mt-4 grid gap-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Phone className="size-3.5" /> {c.contacto} · {c.telefono}
                </span>
                <span className="flex items-center gap-2">
                  <Mail className="size-3.5" /> {c.email}
                </span>
              </div>

              <div className="mt-4 rounded-lg bg-muted/60 p-3 text-xs">
                <p className="mb-1 flex items-center gap-2 font-semibold text-foreground">
                  <KeyRound className="size-3.5" /> Datos de acceso
                </p>
                <ul className="space-y-0.5 text-muted-foreground">
                  {c.acceso.portero ? <li>Portero: {c.acceso.portero}</li> : null}
                  {c.acceso.llaves ? <li>Llaves: {c.acceso.llaves}</li> : null}
                  {c.acceso.alarma ? (
                    <li className="flex items-center gap-1">
                      <ShieldAlert className="size-3" /> {c.acceso.alarma}
                    </li>
                  ) : null}
                  {c.acceso.notas ? <li>Notas: {c.acceso.notas}</li> : null}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}

function Campo({
  label,
  valor,
  set,
}: {
  label: string;
  valor: string;
  set: (v: string) => void;
}) {
  const id = `campo-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} value={valor} onChange={(e) => set(e.target.value)} />
    </div>
  );
}
