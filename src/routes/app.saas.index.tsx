import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Building2, CheckCircle2, PauseCircle, Layers, Users2, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Pill, Stat, TituloSeccion } from "@/components/nitidia/ui";
import { fechaCorta, setDB, useDB, useSesion } from "@/lib/nitidia/store";
import { PLANES, type PlanSaaS } from "@/lib/nitidia/types";

export const Route = createFileRoute("/app/saas/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Panel del SaaS · Nitidia" },
      {
        name: "description",
        content: "Vista global de todas las empresas suscritas a Nitidia: planes, actividad y estado.",
      },
      { property: "og:title", content: "Panel del SaaS · Nitidia" },
      { property: "og:description", content: "Gestión global de tenants, planes y activación." },
    ],
  }),
  component: PanelSaaS,
});

export function alternarEmpresa(id: string) {
  let activa = false;
  setDB((db) => ({
    ...db,
    empresas: db.empresas.map((e) => {
      if (e.id !== id) return e;
      activa = !e.activo;
      return { ...e, activo: activa };
    }),
  }));
  return activa;
}

function PanelSaaS() {
  const sesion = useSesion();
  const db = useDB();
  const navigate = useNavigate();

  useEffect(() => {
    if (sesion && sesion.nivel !== "saas") navigate({ to: "/app", replace: true });
  }, [sesion, navigate]);

  if (!sesion || sesion.nivel !== "saas") return null;

  const activas = db.empresas.filter((e) => e.activo).length;
  const porPlan = (p: PlanSaaS) => db.empresas.filter((e) => e.plan === p).length;

  return (
    <>
      <TituloSeccion
        titulo="Vista general del SaaS"
        descripcion="Actividad agregada de todas las empresas suscritas a Nitidia."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          etiqueta="Empresas"
          valor={String(db.empresas.length)}
          detalle={`${activas} activas · ${db.empresas.length - activas} inactivas`}
          icono={<Building2 className="size-5" />}
        />
        <Stat
          etiqueta="Clientes agregados"
          valor={String(db.clientes.length)}
          detalle="Suma de todos los tenants"
          icono={<Users2 className="size-5" />}
        />
        <Stat
          etiqueta="Servicios agregados"
          valor={String(db.servicios.length)}
          detalle={`${db.facturas.length} facturas emitidas`}
          icono={<Layers className="size-5" />}
        />
        <Stat
          etiqueta="Distribución por plan"
          valor={`${porPlan("pro")} · ${porPlan("starter")} · ${porPlan("prueba")}`}
          detalle="Pro · Starter · Prueba"
          icono={<CheckCircle2 className="size-5" />}
        />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {(["prueba", "starter", "pro"] as PlanSaaS[]).map((p) => (
          <div key={p} className="superficie p-5">
            <p className="text-sm font-medium text-muted-foreground">{PLANES[p].etiqueta}</p>
            <p className="font-display mt-1 text-2xl font-semibold">{porPlan(p)} empresas</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {PLANES[p].precio === 0 ? "Gratis" : `${PLANES[p].precio} €/mes`} · hasta{" "}
              {PLANES[p].limiteClientes} clientes
            </p>
          </div>
        ))}
      </div>

      <h2 className="font-display mt-10 mb-4 text-xl font-semibold">Empresas</h2>
      <div className="superficie overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Empresa</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Alta</th>
              <th className="px-4 py-3 text-right">Clientes</th>
              <th className="px-4 py-3 text-right">Cuadrillas</th>
              <th className="px-4 py-3 text-right">Servicios</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {db.empresas.map((e) => (
              <tr key={e.id} className="hover:bg-muted/40">
                <td className="px-4 py-3">
                  <Link
                    to="/app/saas/$id"
                    params={{ id: e.id }}
                    className="inline-flex items-center gap-1 font-medium text-foreground hover:text-primary"
                  >
                    {e.nombre}
                    <ChevronRight className="size-4" />
                  </Link>
                  <span className="block text-xs text-muted-foreground">{e.emailContacto}</span>
                </td>
                <td className="px-4 py-3">
                  <Pill tono={e.plan === "pro" ? "verde" : e.plan === "starter" ? "azul" : "ambar"}>
                    {PLANES[e.plan].etiqueta}
                  </Pill>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{e.alta ? fechaCorta(e.alta) : "—"}</td>
                <td className="px-4 py-3 text-right">
                  {db.clientes.filter((c) => c.tenantId === e.id).length}
                </td>
                <td className="px-4 py-3 text-right">
                  {db.cuadrillas.filter((c) => c.tenantId === e.id).length}
                </td>
                <td className="px-4 py-3 text-right">
                  {db.servicios.filter((s) => s.tenantId === e.id).length}
                </td>
                <td className="px-4 py-3">
                  {e.activo ? <Pill tono="verde">Activa</Pill> : <Pill tono="rojo">Inactiva</Pill>}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    variant={e.activo ? "outline" : "default"}
                    size="sm"
                    onClick={() => {
                      const activa = alternarEmpresa(e.id);
                      toast.success(
                        activa ? `${e.nombre} activada` : `${e.nombre} desactivada: sus usuarios no podrán entrar`,
                      );
                    }}
                  >
                    {e.activo ? (
                      <>
                        <PauseCircle className="size-4" /> Desactivar
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="size-4" /> Activar
                      </>
                    )}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
