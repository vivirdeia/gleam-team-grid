import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowLeft, CheckCircle2, PauseCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Pill, Stat, TituloSeccion } from "@/components/nitidia/ui";
import { euros, fechaCorta, useDB, useSesion } from "@/lib/nitidia/store";
import { PLANES } from "@/lib/nitidia/types";
import { alternarEmpresa } from "./app.saas.index";

export const Route = createFileRoute("/app/saas/$id")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Detalle de empresa · Nitidia" },
      {
        name: "description",
        content: "Ficha de una empresa suscrita a Nitidia: plan, actividad y estado de la cuenta.",
      },
      { property: "og:title", content: "Detalle de empresa · Nitidia" },
      { property: "og:description", content: "Datos y actividad de un tenant del SaaS." },
    ],
  }),
  component: DetalleEmpresa,
});

function DetalleEmpresa() {
  const { id } = Route.useParams();
  const sesion = useSesion();
  const db = useDB();
  const navigate = useNavigate();

  useEffect(() => {
    if (sesion && sesion.nivel !== "saas") navigate({ to: "/app", replace: true });
  }, [sesion, navigate]);

  if (!sesion || sesion.nivel !== "saas") return null;

  const empresa = db.empresas.find((e) => e.id === id);
  if (!empresa) {
    return (
      <div className="superficie p-8 text-center">
        <p className="text-sm text-muted-foreground">Esta empresa ya no existe.</p>
        <Link to="/app/saas" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
          Volver al listado
        </Link>
      </div>
    );
  }

  const clientes = db.clientes.filter((c) => c.tenantId === empresa.id);
  const cuadrillas = db.cuadrillas.filter((c) => c.tenantId === empresa.id);
  const servicios = db.servicios.filter((s) => s.tenantId === empresa.id);
  const facturas = db.facturas.filter((f) => f.tenantId === empresa.id);
  const facturado = facturas.reduce((t, f) => t + f.total, 0);
  const pendiente = facturas.filter((f) => f.estado === "pendiente").reduce((t, f) => t + f.total, 0);
  const completados = servicios.filter((s) => s.estado === "completado").length;

  return (
    <>
      <Link
        to="/app/saas"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Empresas
      </Link>

      <TituloSeccion
        titulo={empresa.nombre}
        descripcion={`${empresa.emailContacto} · alta ${empresa.alta ? fechaCorta(empresa.alta) : "—"}`}
        accion={
          <Button
            variant={empresa.activo ? "outline" : "default"}
            onClick={() => {
              const activa = alternarEmpresa(empresa.id);
              toast.success(activa ? `${empresa.nombre} activada` : `${empresa.nombre} desactivada`);
            }}
          >
            {empresa.activo ? (
              <>
                <PauseCircle className="size-4" /> Desactivar cuenta
              </>
            ) : (
              <>
                <CheckCircle2 className="size-4" /> Activar cuenta
              </>
            )}
          </Button>
        }
      />

      <div className="superficie mb-6 grid gap-4 p-6 sm:grid-cols-3">
        <div>
          <p className="text-xs uppercase text-muted-foreground">Plan</p>
          <p className="mt-1 font-medium">
            {PLANES[empresa.plan].etiqueta} ·{" "}
            {PLANES[empresa.plan].precio === 0 ? "gratis" : `${PLANES[empresa.plan].precio} €/mes`}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase text-muted-foreground">Identificador</p>
          <p className="mt-1 font-medium">{empresa.slug}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-muted-foreground">Estado</p>
          <p className="mt-1">
            {empresa.activo ? <Pill tono="verde">Activa</Pill> : <Pill tono="rojo">Inactiva</Pill>}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat etiqueta="Clientes" valor={String(clientes.length)} detalle={`Límite del plan: ${PLANES[empresa.plan].limiteClientes}`} />
        <Stat etiqueta="Cuadrillas" valor={String(cuadrillas.length)} />
        <Stat etiqueta="Servicios" valor={String(servicios.length)} detalle={`${completados} completados`} />
        <Stat etiqueta="Facturado" valor={euros(facturado)} detalle={`${euros(pendiente)} pendiente`} />
      </div>

      <h2 className="font-display mt-10 mb-4 text-xl font-semibold">Clientes de la empresa</h2>
      <div className="superficie overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Zona</th>
              <th className="px-4 py-3">Frecuencia</th>
              <th className="px-4 py-3 text-right">Tarifa</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {clientes.map((c) => (
              <tr key={c.id} className="hover:bg-muted/40">
                <td className="px-4 py-3 font-medium">{c.nombre}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.zona}</td>
                <td className="px-4 py-3 capitalize text-muted-foreground">{c.frecuencia}</td>
                <td className="px-4 py-3 text-right">{euros(c.tarifa)}</td>
              </tr>
            ))}
            {clientes.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                  Sin clientes todavía.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </>
  );
}
