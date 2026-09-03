import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Receipt,
  RotateCcw,
  Users,
  Building2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/nitidia/ui";
import { resetDemo, setSesion, useDB, useSesion } from "@/lib/nitidia/store";

export const Route = createFileRoute("/app")({
  ssr: false,
  component: LayoutApp,
});

const NAV_ADMIN = [
  { to: "/app", label: "Panel", icono: LayoutDashboard, exact: true },
  { to: "/app/planificacion", label: "Planificación", icono: CalendarDays },
  { to: "/app/clientes", label: "Clientes", icono: Building2 },
  { to: "/app/cuadrillas", label: "Cuadrillas", icono: Users },
  { to: "/app/facturacion", label: "Facturación", icono: Receipt },
] as const;

const NAV_CUADRILLA = [
  { to: "/app/mis-servicios", label: "Mis servicios", icono: ClipboardList, exact: true },
] as const;

function LayoutApp() {
  const sesion = useSesion();
  const db = useDB();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!sesion) navigate({ to: "/login", replace: true });
  }, [sesion, navigate]);

  if (!sesion) return null;

  const esSaas = sesion.nivel === "saas";
  const esAdmin = sesion.nivel !== "tenant" || sesion.rol === "admin";
  const nav = esSaas ? [] : esAdmin ? NAV_ADMIN : NAV_CUADRILLA;
  const empresa = sesion.nivel === "tenant" ? db.empresas.find((e) => e.id === sesion.tenantId) : undefined;
  const cuadrilla = db.cuadrillas.find(
    (c) => sesion.nivel === "tenant" && c.id === sesion.cuadrillaId,
  );

  function salir() {
    setSesion(null);
    navigate({ to: "/login", replace: true });
  }

  return (
    <div className="fondo-fresco min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-4 px-6 py-3">
          <Logo />
          <nav className="order-3 flex flex-1 flex-wrap gap-1 md:order-2">
            {nav.map((item) => {
              const activo =
                "exact" in item && item.exact ? pathname === item.to : pathname.startsWith(item.to);
              const Icono = item.icono;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    activo
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icono className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="order-2 ml-auto flex items-center gap-2 md:order-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-foreground">{sesion.nombre}</p>
              <p className="text-xs text-muted-foreground">
                {esSaas
                  ? "Super admin del SaaS"
                  : esAdmin
                    ? (empresa?.nombre ?? "Empresa")
                    : (cuadrilla?.nombre ?? "Cuadrilla")}
              </p>
            </div>
            {esSaas ? (
              <Button
                variant="ghost"
                size="icon"
                title="Restaurar datos de demo (todas las empresas)"
                onClick={() => {
                  resetDemo();
                  toast.success("Datos de demo restaurados");
                }}
              >
                <RotateCcw className="size-4" />
              </Button>
            ) : null}
            <Button variant="outline" size="sm" onClick={salir}>
              <LogOut className="size-4" /> Salir
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-6 py-8">
        {esSaas ? <PanelSaaS /> : <Outlet />}
      </main>
    </div>
  );
}

function PanelSaaS() {
  const db = useDB();

  return (
    <section>
      <div className="superficie mb-6 flex items-start gap-3 p-6">
        <Building2 className="mt-0.5 size-5 shrink-0 text-primary" />
        <div>
          <h1 className="font-display text-xl font-semibold">Panel de super admin en construcción</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Aquí verás todas las empresas del SaaS. De momento es una vista de solo lectura; la
            gestión completa llega en la siguiente fase.
          </p>
        </div>
      </div>

      <div className="superficie overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Empresa</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3 text-right">Clientes</th>
              <th className="px-4 py-3 text-right">Servicios</th>
              <th className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {db.empresas.map((e) => (
              <tr key={e.id} className="hover:bg-muted/40">
                <td className="px-4 py-3 font-medium">{e.nombre}</td>
                <td className="px-4 py-3 capitalize text-muted-foreground">{e.plan}</td>
                <td className="px-4 py-3 text-right">
                  {db.clientes.filter((c) => c.tenantId === e.id).length}
                </td>
                <td className="px-4 py-3 text-right">
                  {db.servicios.filter((s) => s.tenantId === e.id).length}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{e.activo ? "Activa" : "Inactiva"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
