import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ShieldCheck, Users, ArrowRight, Building2, UserCog } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo, Pill } from "@/components/nitidia/ui";
import { getDB, setSesion, useDB } from "@/lib/nitidia/store";
import { PLANES } from "@/lib/nitidia/types";

export const Route = createFileRoute("/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Acceder a Nitidia · Software para empresas de limpieza" },
      {
        name: "description",
        content:
          "Entra en Nitidia como super admin del SaaS o como empresa cliente (admin o cuadrilla) y gestiona servicios, checklists y facturación.",
      },
      { property: "og:title", content: "Acceder a Nitidia" },
      {
        property: "og:description",
        content: "Acceso demo con dos niveles: super admin del SaaS y usuarios de cada empresa cliente.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Login,
});

type Modo = "saas" | "empresa";

function Login() {
  const navigate = useNavigate();
  const db = useDB();
  const [modo, setModo] = useState<Modo>("empresa");
  const [empresaId, setEmpresaId] = useState(() => getDB().empresas[0]?.id ?? "");
  const [perfil, setPerfil] = useState<"admin" | string>("admin");
  const [pin, setPin] = useState("");

  const empresa = db.empresas.find((e) => e.id === empresaId) ?? db.empresas[0];
  const cuadrillas = useMemo(
    () => db.cuadrillas.filter((c) => c.tenantId === empresa?.id),
    [db.cuadrillas, empresa?.id],
  );

  function entrarSaas() {
    setSesion({ nivel: "saas", nombre: "Equipo Nitidia", email: "admin@nitidia.app" });
    toast.success("Sesión de super admin del SaaS");
    navigate({ to: "/app" });
  }

  function entrarEmpresa(e: React.FormEvent) {
    e.preventDefault();
    if (!empresa) return;
    if (!empresa.activo) {
      toast.error(
        `${empresa.nombre} tiene la cuenta desactivada. Contacta con el equipo de Nitidia para reactivarla.`,
      );
      return;
    }
    if (perfil === "admin") {
      const esperado = empresa.pinAdmin ?? "0000";
      if (pin.trim() !== esperado) {
        toast.error("PIN de administración incorrecto");
        return;
      }
      setSesion({ nivel: "tenant", tenantId: empresa.id, rol: "admin", nombre: empresa.nombre });
      toast.success(`Bienvenido a ${empresa.nombre}`);
      navigate({ to: "/app" });
      return;
    }
    const cu = cuadrillas.find((c) => c.id === perfil);
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
        <Link to="/">
          <Logo />
        </Link>
        <span className="text-xs font-medium text-muted-foreground">Demo · datos locales</span>
      </header>

      <div className="mx-auto w-full max-w-3xl flex-1 px-6 pb-16">
        <h1 className="font-display text-3xl font-semibold text-foreground">Acceder a Nitidia</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Elige tu nivel de acceso. Los datos se guardan solo en tu navegador.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setModo("saas")}
            className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
              modo === "saas" ? "border-primary bg-primary/5" : "border-border hover:bg-muted/60"
            }`}
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShieldCheck className="size-5" />
            </span>
            <span>
              <span className="block text-sm font-semibold">Soy super admin del SaaS</span>
              <span className="block text-xs text-muted-foreground">
                Vista global de todas las empresas suscritas
              </span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => setModo("empresa")}
            className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
              modo === "empresa" ? "border-primary bg-primary/5" : "border-border hover:bg-muted/60"
            }`}
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
              <Building2 className="size-5" />
            </span>
            <span>
              <span className="block text-sm font-semibold">Soy una empresa cliente</span>
              <span className="block text-xs text-muted-foreground">
                Entra como administración o como cuadrilla
              </span>
            </span>
          </button>
        </div>

        {modo === "saas" ? (
          <section className="superficie mt-6 p-7">
            <h2 className="font-display text-lg font-semibold">Panel del SaaS</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Accede sin tenant asignado: verás las {db.empresas.length} empresas registradas, su
              plan y su actividad.
            </p>
            <ul className="mt-4 grid gap-2">
              {db.empresas.map((e) => (
                <li
                  key={e.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3 text-sm"
                >
                  <span className="font-medium">{e.nombre}</span>
                  <Pill tono={e.plan === "pro" ? "verde" : e.plan === "starter" ? "azul" : "ambar"}>
                    {PLANES[e.plan].etiqueta}
                  </Pill>
                </li>
              ))}
            </ul>
            <Button onClick={entrarSaas} className="mt-5 w-full group">
              Entrar como super admin
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </section>
        ) : (
          <section className="superficie mt-6 p-7">
            <h2 className="font-display text-lg font-semibold">Acceso de empresa cliente</h2>
            <form onSubmit={entrarEmpresa} className="mt-5 space-y-5">
              <div className="space-y-2">
                <Label>Empresa</Label>
                <div className="grid gap-2">
                  {db.empresas.map((e) => (
                    <button
                      key={e.id}
                      type="button"
                      onClick={() => {
                        setEmpresaId(e.id);
                        setPerfil("admin");
                        setPin("");
                      }}
                      className={`flex items-center gap-3 rounded-lg border p-3 text-left text-sm transition-colors ${
                        empresa?.id === e.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted/60"
                      }`}
                    >
                      <span className="flex-1">
                        <span className="block font-medium">{e.nombre}</span>
                        <span className="block text-xs text-muted-foreground">{e.emailContacto}</span>
                      </span>
                      {e.activo ? (
                        <Pill tono={e.plan === "pro" ? "verde" : e.plan === "starter" ? "azul" : "ambar"}>
                          {PLANES[e.plan].etiqueta}
                        </Pill>
                      ) : (
                        <Pill tono="rojo">Cuenta inactiva</Pill>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Perfil</Label>
                <div className="grid gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPerfil("admin");
                      setPin("");
                    }}
                    className={`flex items-center gap-3 rounded-lg border p-3 text-left text-sm transition-colors ${
                      perfil === "admin"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/60"
                    }`}
                  >
                    <UserCog className="size-4 text-primary" />
                    <span className="flex-1">
                      <span className="block font-medium">Administración</span>
                      <span className="block text-xs text-muted-foreground">
                        Clientes, cuadrillas, planificación y facturación
                      </span>
                    </span>
                  </button>
                  {cuadrillas.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setPerfil(c.id);
                        setPin("");
                      }}
                      className={`flex items-center gap-3 rounded-lg border p-3 text-left text-sm transition-colors ${
                        perfil === c.id
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
                  {perfil === "admin"
                    ? `PIN de administración de ${empresa?.nombre ?? "la empresa"}: ${empresa?.pinAdmin ?? "0000"}`
                    : "PIN demo de cuadrillas: 1111 · 2222 · 3333"}
                </p>
              </div>

              <Button type="submit" className="w-full">
                Entrar
              </Button>
            </form>
          </section>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          ¿Aún no tienes cuenta?{" "}
          <Link to="/registro" className="font-medium text-primary hover:underline">
            Crea tu empresa gratis
          </Link>
        </p>
      </div>
    </main>
  );
}
