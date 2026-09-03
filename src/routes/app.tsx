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
import { Atribucion, Logo } from "@/components/nitidia/ui";
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

const NAV_SAAS = [
  { to: "/app/saas", label: "Vista general", icono: LayoutDashboard, exact: true },
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
  const nav = esSaas ? NAV_SAAS : esAdmin ? NAV_ADMIN : NAV_CUADRILLA;
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
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6">
          <Logo />
          <nav className="order-3 -mx-1 flex w-full min-w-0 basis-full gap-1 overflow-x-auto px-1 pb-1 md:order-2 md:w-auto md:flex-1 md:basis-auto md:flex-wrap md:overflow-visible md:pb-0">
            {nav.map((item) => {
              const activo =
                "exact" in item && item.exact ? pathname === item.to : pathname.startsWith(item.to);
              const Icono = item.icono;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
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

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <Outlet />
      </main>

      <footer className="border-t border-border/60 px-4 py-5 text-center sm:px-6">
        <Atribucion />
      </footer>
    </div>
  );
}
