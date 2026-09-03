import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, CheckCircle2, Sparkle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/nitidia/ui";
import { registrarEmpresa } from "@/lib/nitidia/onboarding";
import { setSesion } from "@/lib/nitidia/store";

export const Route = createFileRoute("/registro")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Crear cuenta gratis · Nitidia" },
      {
        name: "description",
        content:
          "Da de alta tu empresa de limpieza en Nitidia en menos de un minuto y empieza con datos de ejemplo listos para probar.",
      },
      { property: "og:title", content: "Crear cuenta gratis en Nitidia" },
      {
        property: "og:description",
        content: "Alta inmediata con cuadrillas y clientes de ejemplo para probar toda la plataforma.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Registro,
});

function Registro() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [zona, setZona] = useState("");
  const [enviando, setEnviando] = useState(false);

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim() || !email.trim()) {
      toast.error("Completa el nombre comercial y el email de contacto");
      return;
    }
    setEnviando(true);
    const empresa = registrarEmpresa({ nombre, emailContacto: email, zona });
    setSesion({
      nivel: "tenant",
      tenantId: empresa.id,
      rol: "admin",
      nombre: empresa.nombre,
    });
    toast.success("Cuenta creada", {
      description: "Aquí tienes datos de ejemplo para que pruebes todo: cuadrillas y clientes ya cargados.",
    });
    navigate({ to: "/app" });
  }

  return (
    <main className="fondo-fresco flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/">
          <Logo />
        </Link>
        <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">
          Ya tengo cuenta
        </Link>
      </header>

      <div className="mx-auto grid w-full max-w-5xl flex-1 items-center gap-10 px-6 pb-16 lg:grid-cols-[1.1fr_1fr]">
        <section>
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">Prueba gratis</p>
          <h1 className="font-display mt-3 text-4xl leading-tight font-semibold text-foreground">
            Crea tu cuenta y empieza con datos de ejemplo
          </h1>
          <p className="mt-4 max-w-lg text-muted-foreground">
            Damos de alta tu empresa con el plan de prueba y sembramos cuadrillas y clientes de
            ejemplo para que veas la plataforma funcionando desde el primer minuto.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-foreground">
            {[
              "2 cuadrillas con zona y disponibilidad",
              "4 clientes de ejemplo (hogar y oficina)",
              "Datos de acceso y frecuencias ya configuradas",
              "Sin tarjeta · todo se guarda en tu navegador",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-exito" />
                {t}
              </li>
            ))}
          </ul>
        </section>

        <section className="superficie p-7">
          <h2 className="font-display flex items-center gap-2 text-lg font-semibold">
            <Sparkle className="size-4 text-primary" />
            Alta de empresa
          </h2>
          <form onSubmit={enviar} className="mt-5 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre comercial</Label>
              <Input
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Limpiezas Aurora"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email de contacto</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hola@limpiezasaurora.es"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zona">Zona o ciudad (opcional)</Label>
              <Input
                id="zona"
                value={zona}
                onChange={(e) => setZona(e.target.value)}
                placeholder="Sevilla · Nervión"
              />
            </div>
            <Button type="submit" className="w-full group" disabled={enviando}>
              Crear cuenta gratis
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <p className="text-xs text-muted-foreground">
              Al crear la cuenta entrarás como administrador de tu empresa. PIN de admin por
              defecto: <span className="font-medium text-foreground">0000</span>.
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}
