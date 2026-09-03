import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Receipt,
  Star,
  Users,
  MapPin,
  ShieldCheck,
  Camera,
  KeyRound,
  Clock3,
  Building2,
  Home,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo, Isotipo } from "@/components/nitidia/ui";
import { Reveal, Blobs, PatronPuntos } from "@/components/nitidia/decor";
import { PLANES } from "@/lib/nitidia/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nitidia · Software de gestión para empresas de limpieza" },
      {
        name: "description",
        content:
          "Nitidia organiza clientes, cuadrillas, planificación, checklists con foto, valoraciones y facturación recurrente para empresas de limpieza de hogares y oficinas.",
      },
      { property: "og:title", content: "Nitidia · Software para empresas de limpieza" },
      {
        property: "og:description",
        content:
          "Clientes con datos de acceso, cuadrillas, planificación semanal, checklists con foto y facturación recurrente en una sola herramienta.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const FUNCIONALIDADES = [
  {
    icon: MapPin,
    titulo: "Clientes y direcciones",
    texto:
      "Ficha completa por dirección: hogar u oficina, portero, llaves, código de alarma y frecuencia contratada.",
    etiquetas: ["Hogar", "Oficina", "Datos de acceso"],
  },
  {
    icon: Users,
    titulo: "Cuadrillas",
    texto:
      "Equipos con zona de trabajo, disponibilidad y asignación directa a las direcciones que les tocan.",
    etiquetas: ["Zonas", "Disponibilidad"],
  },
  {
    icon: CalendarDays,
    titulo: "Planificación semanal",
    texto:
      "Calendario con cada servicio asignado a su cuadrilla y estado en tiempo real: pendiente, en curso o completado.",
    etiquetas: ["Calendario", "Estados"],
  },
  {
    icon: ClipboardCheck,
    titulo: "Checklist con fotos",
    texto:
      "Plantillas por tipo de espacio (baño, cocina, salón, despachos). La cuadrilla marca y adjunta foto del resultado.",
    etiquetas: ["Plantillas", "Evidencia"],
  },
  {
    icon: Star,
    titulo: "Valoración del cliente",
    texto:
      "Al cerrar el servicio, el cliente recibe un enlace para puntuar de 1 a 5 y dejar su comentario.",
    etiquetas: ["Enlace público", "1 a 5"],
  },
  {
    icon: Receipt,
    titulo: "Facturación recurrente",
    texto:
      "Facturas generadas según la frecuencia contratada, con historial de pagos y estado pagada o pendiente.",
    etiquetas: ["Periodos", "Historial"],
  },
];

const FLUJO = [
  { icon: KeyRound, titulo: "Alta del cliente", texto: "Dirección, accesos y frecuencia." },
  { icon: CalendarDays, titulo: "Planificación", texto: "Servicio asignado a una cuadrilla." },
  { icon: Camera, titulo: "Ejecución", texto: "Checklist marcado con foto." },
  { icon: Receipt, titulo: "Cobro", texto: "Factura del periodo y valoración." },
];

const PLAN_DETALLE: Record<
  keyof typeof PLANES,
  { resumen: string; incluye: string[]; destacado?: boolean }
> = {
  prueba: {
    resumen: "Para probar Nitidia con tu operativa real, sin tarjeta.",
    incluye: ["1 cuadrilla activa", "Planificación y checklists", "Datos de demo incluidos"],
  },
  starter: {
    resumen: "Para empresas locales con varias cuadrillas en marcha.",
    incluye: [
      "Cuadrillas ilimitadas",
      "Valoraciones de cliente",
      "Facturación recurrente",
      "Historial de pagos",
    ],
    destacado: true,
  },
  pro: {
    resumen: "Para operadores con varias zonas y alto volumen de servicios.",
    incluye: [
      "Todo lo de Starter",
      "Panel global multi-zona",
      "Informes de calidad y valoraciones",
      "Soporte prioritario",
    ],
  },
};

const TESTIMONIOS = [
  {
    empresa: "Brillo Madrid Servicios",
    zona: "Madrid · 3 cuadrillas",
    texto:
      "Antes cuadrábamos las rutas en un grupo de WhatsApp. Con Nitidia cada cuadrilla abre su día y sabe exactamente qué dirección, qué llaves y qué tareas le tocan.",
    persona: "Elena Cortés, dirección de operaciones",
    inicial: "BM",
  },
  {
    empresa: "Clara Levante Limpiezas",
    zona: "Valencia · 2 cuadrillas",
    texto:
      "El checklist con foto nos ha quitado discusiones con clientes de oficinas. Enviamos el enlace de valoración y cerramos el servicio con una nota media visible.",
    persona: "Marta Benavent, gerente",
    inicial: "CL",
  },
  {
    empresa: "NorteLimp Bilbao",
    zona: "Bilbao · en prueba gratis",
    texto:
      "Empezamos con el plan de prueba y en dos semanas ya teníamos toda la cartera y las facturas mensuales generándose solas.",
    persona: "Iker Aramburu, fundador",
    inicial: "NL",
  },
];

const METRICAS = [
  { icon: Clock3, valor: "6 h", texto: "ahorradas cada semana en planificación" },
  { icon: TrendingUp, valor: "+23 %", texto: "de facturas cobradas a tiempo" },
  { icon: Star, valor: "4,7", texto: "valoración media de los clientes" },
];

function Landing() {
  return (
    <div className="fondo-fresco min-h-screen">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/75 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <Logo />
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#funcionalidades" className="story-link transition-colors hover:text-foreground">
              Funcionalidades
            </a>
            <a href="#precios" className="story-link transition-colors hover:text-foreground">
              Precios
            </a>
            <a href="#clientes" className="story-link transition-colors hover:text-foreground">
              Clientes
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/login">Iniciar sesión</Link>
            </Button>
            <Button asChild size="sm" className="transition-transform hover:-translate-y-0.5">
              <Link to="/login">Empieza gratis</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <Blobs />
          <PatronPuntos className="opacity-70" />
          <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-3 py-1 text-xs font-semibold tracking-wide text-primary uppercase backdrop-blur">
                <span className="pulso-suave size-2 rounded-full bg-exito" />
                Software para empresas de limpieza
              </span>
              <h1 className="font-display mt-5 text-4xl leading-tight font-semibold text-foreground sm:text-5xl lg:text-6xl">
                Tu operativa de limpieza,
                <span className="relative ml-2 inline-block">
                  <span className="relative z-10">brillante</span>
                  <span className="absolute inset-x-0 bottom-1 z-0 h-3 rounded-full bg-accent/70" />
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-lg text-muted-foreground">
                Nitidia reúne clientes y direcciones, cuadrillas, planificación semanal, checklists
                con foto, valoraciones y facturación recurrente. Todo en un panel pensado para
                hogares y oficinas.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild size="lg" className="group transition-transform hover:-translate-y-0.5">
                  <Link to="/login">
                    Empieza gratis
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="transition-colors hover:border-primary/50"
                >
                  <Link to="/login">Ver demo</Link>
                </Button>
              </div>
              <ul className="mt-8 grid gap-2 text-sm text-foreground sm:grid-cols-2">
                {[
                  "Sin instalación ni configuración",
                  "Datos de demo listos para probar",
                  "Cuadrillas con acceso por PIN",
                  "Facturación automática por periodo",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-exito" />
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={120} className="relative my-10 lg:my-8">
              <div className="fondo-suave absolute -inset-4 -z-10 rounded-[2rem] opacity-40 blur-2xl" />
              <div className="superficie relative p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Servicios de hoy</span>
                  <span className="text-xs text-muted-foreground">Cuadrilla Azul · Centro</span>
                </div>
                <div className="mt-4 space-y-3">
                  {[
                    {
                      h: "08:30",
                      d: "C/ Serrano 45",
                      tipo: "Oficina",
                      e: "Completado",
                      tono: "text-exito",
                      Icono: Building2,
                    },
                    {
                      h: "10:00",
                      d: "Av. Reina Victoria 12",
                      tipo: "Hogar",
                      e: "En curso",
                      tono: "text-primary",
                      Icono: Home,
                    },
                    {
                      h: "12:15",
                      d: "C/ Alcalá 210",
                      tipo: "Oficina",
                      e: "Pendiente",
                      tono: "text-muted-foreground",
                      Icono: Building2,
                    },
                  ].map((s) => (
                    <div
                      key={s.h}
                      className="tarjeta-hover flex items-center gap-3 rounded-xl border border-border bg-card p-3"
                    >
                      <span className="fondo-suave flex size-9 items-center justify-center rounded-lg text-accent-foreground">
                        <s.Icono className="size-4" />
                      </span>
                      <span className="flex-1">
                        <span className="block text-sm font-medium text-foreground">{s.d}</span>
                        <span className="block text-xs text-muted-foreground">
                          {s.h} · {s.tipo}
                        </span>
                      </span>
                      <span className={`text-xs font-medium ${s.tono}`}>{s.e}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-xl bg-secondary/50 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Star className="size-4 fill-current text-aviso-foreground" />
                    Valoración media 4,7 sobre 5
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Basado en las valoraciones enviadas al cerrar cada servicio.
                  </p>
                </div>
              </div>

              {/* Tarjetas flotantes decorativas */}
              <div className="superficie flotar-suave absolute -bottom-11 -left-4 hidden items-center gap-2 p-3 sm:flex">
                <span className="flex size-8 items-center justify-center rounded-lg bg-exito/15 text-exito">
                  <ClipboardCheck className="size-4" />
                </span>
                <span className="text-xs">
                  <span className="block font-semibold">Checklist 12/12</span>
                  <span className="block text-muted-foreground">con 3 fotos</span>
                </span>
              </div>
              <div className="superficie flotar absolute -top-11 right-0 hidden items-center gap-2 p-3 lg:flex">
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Receipt className="size-4" />
                </span>
                <span className="text-xs">
                  <span className="block font-semibold">Factura enviada</span>
                  <span className="block text-muted-foreground">Mayo · 1.240 €</span>
                </span>
              </div>
            </Reveal>
          </div>

          {/* Métricas */}
          <div className="relative mx-auto w-full max-w-6xl px-6 pb-16">
            <Reveal className="grid gap-4 sm:grid-cols-3">
              {METRICAS.map((m) => (
                <div key={m.valor} className="superficie tarjeta-hover flex items-center gap-4 p-5">
                  <span className="fondo-suave flex size-11 items-center justify-center rounded-xl text-accent-foreground">
                    <m.icon className="size-5" />
                  </span>
                  <span>
                    <span className="font-display block text-2xl font-semibold">{m.valor}</span>
                    <span className="block text-xs text-muted-foreground">{m.texto}</span>
                  </span>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* Funcionalidades */}
        <section
          id="funcionalidades"
          className="relative overflow-hidden border-t border-border/60 bg-background/60 py-20"
        >
          <div className="patron-malla pointer-events-none absolute inset-0 opacity-70" aria-hidden />
          <div className="relative mx-auto w-full max-w-6xl px-6">
            <Reveal>
              <h2 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
                Todo lo que necesita una empresa de limpieza
              </h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                Sin hojas de cálculo ni grupos de mensajería: una sola herramienta desde el alta del
                cliente hasta la factura cobrada.
              </p>
            </Reveal>
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {FUNCIONALIDADES.map((f, i) => (
                <Reveal key={f.titulo} delay={i * 70} as="article" className="h-full">
                  <div className="superficie tarjeta-hover group h-full p-6">
                    <span className="fondo-suave flex size-11 items-center justify-center rounded-xl text-accent-foreground transition-transform duration-300 group-hover:scale-110">
                      <f.icon className="size-5" />
                    </span>
                    <h3 className="font-display mt-4 text-lg font-semibold">{f.titulo}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{f.texto}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {f.etiquetas.map((e) => (
                        <span
                          key={e}
                          className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
                        >
                          {e}
                        </span>
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Flujo de trabajo */}
        <section className="relative overflow-hidden py-20">
          <div className="mx-auto w-full max-w-6xl px-6">
            <Reveal>
              <h2 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
                Del alta al cobro, en cuatro pasos
              </h2>
            </Reveal>
            <div className="relative mt-10 grid gap-5 md:grid-cols-4">
              <div
                className="absolute top-9 right-6 left-6 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block"
                aria-hidden
              />
              {FLUJO.map((p, i) => (
                <Reveal key={p.titulo} delay={i * 90} className="relative">
                  <div className="superficie tarjeta-hover h-full p-5 text-center">
                    <span className="fondo-suave mx-auto flex size-12 items-center justify-center rounded-2xl text-accent-foreground">
                      <p.icon className="size-5" />
                    </span>
                    <span className="mt-3 block text-xs font-semibold text-primary">
                      Paso {i + 1}
                    </span>
                    <h3 className="font-display mt-1 text-base font-semibold">{p.titulo}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{p.texto}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Precios */}
        <section id="precios" className="relative overflow-hidden border-t border-border/60 py-20">
          <PatronPuntos className="opacity-50" />
          <div className="relative mx-auto w-full max-w-6xl px-6">
            <Reveal>
              <h2 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
                Planes claros, sin permanencia
              </h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                Empieza gratis y cambia de plan cuando crezca tu cartera de clientes.
              </p>
            </Reveal>
            <div className="mt-10 grid items-start gap-6 lg:grid-cols-3">
              {(Object.keys(PLANES) as (keyof typeof PLANES)[]).map((clave, i) => {
                const plan = PLANES[clave];
                const detalle = PLAN_DETALLE[clave];
                return (
                  <Reveal key={clave} delay={i * 90} as="article" className="h-full">
                    <div
                      className={`superficie tarjeta-hover flex h-full flex-col p-7 ${
                        detalle.destacado ? "ring-2 ring-primary" : ""
                      }`}
                    >
                      {detalle.destacado && (
                        <span className="mb-3 inline-flex w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                          El más elegido
                        </span>
                      )}
                      <h3 className="font-display text-xl font-semibold">{plan.etiqueta}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{detalle.resumen}</p>
                      <p className="mt-5 flex items-end gap-1">
                        <span className="font-display text-4xl font-semibold text-foreground">
                          {plan.precio === 0 ? "0 €" : `${plan.precio} €`}
                        </span>
                        <span className="pb-1 text-sm text-muted-foreground">/ mes</span>
                      </p>
                      <p className="mt-2 text-sm font-medium text-foreground">
                        Hasta {plan.limiteClientes} clientes
                      </p>
                      <ul className="mt-5 flex-1 space-y-2 text-sm text-muted-foreground">
                        {detalle.incluye.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-exito" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <Button
                        asChild
                        className="mt-7 transition-transform hover:-translate-y-0.5"
                        variant={detalle.destacado ? "default" : "outline"}
                      >
                        <Link to="/login">
                          {plan.precio === 0 ? "Empieza gratis" : `Elegir ${plan.etiqueta}`}
                        </Link>
                      </Button>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonios */}
        <section
          id="clientes"
          className="relative overflow-hidden border-t border-border/60 bg-background/60 py-20"
        >
          <div className="relative mx-auto w-full max-w-6xl px-6">
            <Reveal>
              <h2 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
                Empresas que confían en Nitidia
              </h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                Operadores de limpieza de hogares y oficinas que ya gestionan su día a día con
                Nitidia.
              </p>
            </Reveal>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {TESTIMONIOS.map((t, i) => (
                <Reveal key={t.empresa} delay={i * 90} as="figure" className="h-full">
                  <div className="superficie tarjeta-hover flex h-full flex-col p-6">
                    <div className="flex items-center gap-1 text-aviso-foreground">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star key={s} className="size-4 fill-current" />
                      ))}
                    </div>
                    <blockquote className="mt-4 flex-1 text-sm text-foreground">
                      “{t.texto}”
                    </blockquote>
                    <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                      <span className="fondo-suave flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold text-accent-foreground">
                        {t.inicial}
                      </span>
                      <span>
                        <span className="block text-sm font-semibold">{t.empresa}</span>
                        <span className="block text-xs text-muted-foreground">{t.persona}</span>
                        <span className="block text-xs text-muted-foreground">{t.zona}</span>
                      </span>
                    </figcaption>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="relative overflow-hidden py-20">
          <Blobs className="opacity-70" />
          <div className="relative mx-auto w-full max-w-4xl px-6">
            <Reveal>
              <div className="superficie flex flex-col items-center p-10 text-center">
                <Isotipo className="size-14 flotar-suave" />
                <h2 className="font-display mt-5 text-3xl font-semibold">
                  Empieza hoy con tu primera cuadrilla
                </h2>
                <p className="mt-3 max-w-xl text-muted-foreground">
                  Prueba gratis con datos de demo cargados. Cuando estés listo, sustitúyelos por tu
                  cartera real de clientes.
                </p>
                <div className="mt-7 flex flex-wrap justify-center gap-3">
                  <Button asChild size="lg" className="group transition-transform hover:-translate-y-0.5">
                    <Link to="/login">
                      Empieza gratis
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link to="/login">Iniciar sesión</Link>
                  </Button>
                </div>
                <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="size-4 text-exito" />
                  Sin tarjeta · Datos guardados en tu navegador
                </p>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 bg-background/70">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-3 text-sm text-muted-foreground">
              Gestión integral para empresas de limpieza de hogares y oficinas.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Producto</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#funcionalidades" className="transition-colors hover:text-foreground">
                  Funcionalidades
                </a>
              </li>
              <li>
                <a href="#precios" className="transition-colors hover:text-foreground">
                  Precios
                </a>
              </li>
              <li>
                <Link to="/login" className="transition-colors hover:text-foreground">
                  Ver demo
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Empresa</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#clientes" className="transition-colors hover:text-foreground">
                  Clientes
                </a>
              </li>
              <li>
                <a href="mailto:hola@nitidia.app" className="transition-colors hover:text-foreground">
                  hola@nitidia.app
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Acceso</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/login" className="transition-colors hover:text-foreground">
                  Iniciar sesión
                </Link>
              </li>
              <li>
                <Link to="/login" className="transition-colors hover:text-foreground">
                  Empieza gratis
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Nitidia · Plantilla SaaS para empresas de limpieza
        </div>
      </footer>
    </div>
  );
}
