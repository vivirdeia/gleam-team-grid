import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/nitidia/ui";
import { getDB, setSesion } from "@/lib/nitidia/store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Acceder a Nitidia · Plantilla SaaS para empresas de limpieza" },
      {
        name: "description",
        content:
          "Accede a la demo de Nitidia como super admin o como cuadrilla y gestiona clientes, servicios, checklists y facturación.",
      },
      { property: "og:title", content: "Acceder a Nitidia" },
      {
        property: "og:description",
        content: "Demo con datos realistas: clientes, cuadrillas, planificación, checklists y facturación.",
      },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const cuadrillas = getDB().cuadrillas;
  const [cuadrillaId, setCuadrillaId] = useState(cuadrillas[0]?.id ?? "");
  const [pin, setPin] = useState("");

  function entrarAdmin() {
    setSesion({
      nivel: "tenant",
      tenantId: cuadrillas[0]?.tenantId ?? "em1",
      rol: "admin",
      nombre: "Elena Cortés",
    });
    toast.success("Bienvenida, Elena");
    navigate({ to: "/app" });
  }

  function entrarCuadrilla(e: React.FormEvent) {
    e.preventDefault();
    const cu = cuadrillas.find((c) => c.id === cuadrillaId);
    if (!cu) return;
    if (pin.trim() !== cu.pin) {
      toast.error("PIN incorrecto");
      return;
    }
    setSesion({
      nivel: "tenant",
      tenantId: cu.tenantId,
      rol: "cuadrilla",
      nombre: cu.responsable,
      cuadrillaId: cu.id,
    });
    toast.success(`Hola, ${cu.nombre}`);
    navigate({ to: "/app/mis-servicios" });
  }

  return (
    <main className="fondo-fresco flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <span className="text-xs font-medium text-muted-foreground">Demo · datos locales</span>
      </header>

      <div className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 px-6 pb-16 lg:grid-cols-2">
        <section>
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">
            Limpieza de hogares y oficinas
          </p>
          <h1 className="font-display mt-3 text-4xl leading-tight font-semibold text-foreground sm:text-5xl">
            Toda tu operativa de limpieza, ordenada y brillante
          </h1>
          <p className="mt-4 max-w-lg text-base text-muted-foreground">
            Nitidia reúne clientes y direcciones, cuadrillas, planificación diaria, checklists con
            foto, valoraciones de cliente y facturación recurrente. Sin configuración: prueba la
            demo ahora mismo.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-foreground">
            {[
              "Clientes con datos de acceso y frecuencia contratada",
              "Cuadrillas con zona, disponibilidad y carga de trabajo",
              "Checklists por área con fotos y valoración del cliente",
              "Facturación automática por periodo e historial de pagos",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-exito" />
                {t}
              </li>
            ))}
          </ul>
        </section>

        <section className="superficie p-7">
          <h2 className="font-display text-lg font-semibold">Acceso a la demo</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Elige un rol. Los datos se guardan solo en tu navegador.
          </p>

          <button
            onClick={entrarAdmin}
            className="mt-5 flex w-full items-center gap-3 rounded-xl border border-border bg-secondary/50 p-4 text-left transition-colors hover:bg-secondary"
          >
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShieldCheck className="size-5" />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-semibold">Entrar como super admin</span>
              <span className="block text-xs text-muted-foreground">
                Vista global de clientes, cuadrillas, servicios y facturación
              </span>
            </span>
            <ArrowRight className="size-4 text-muted-foreground" />
          </button>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />o accede con tu cuadrilla
            <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={entrarCuadrilla} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cuadrilla">Cuadrilla</Label>
              <div className="grid gap-2">
                {cuadrillas.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCuadrillaId(c.id)}
                    className={`flex items-center gap-3 rounded-lg border p-3 text-left text-sm transition-colors ${
                      cuadrillaId === c.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/60"
                    }`}
                  >
                    <span
                      className="size-3 rounded-full"
                      style={{ backgroundColor: c.color }}
                      aria-hidden
                    />
                    <span className="flex-1">
                      <span className="block font-medium">{c.nombre}</span>
                      <span className="block text-xs text-muted-foreground">{c.zona}</span>
                    </span>
                    <Users className="size-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pin">PIN de acceso</Label>
              <Input
                id="pin"
                inputMode="numeric"
                placeholder="4 dígitos"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                PIN demo: Azul 1111 · Menta 2222 · Aurora 3333
              </p>
            </div>
            <Button type="submit" className="w-full">
              Entrar como cuadrilla
            </Button>
          </form>
        </section>
      </div>
    </main>
  );
}
