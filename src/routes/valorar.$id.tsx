import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Estrellas, Logo } from "@/components/nitidia/ui";
import { fechaLarga, setDB, useDB } from "@/lib/nitidia/store";

export const Route = createFileRoute("/valorar/$id")({
  head: () => ({
    meta: [
      { title: "Valora tu limpieza · Nitidia" },
      {
        name: "description",
        content: "Puntúa el servicio de limpieza recibido y deja un comentario para el equipo.",
      },
      { property: "og:title", content: "Valora tu limpieza · Nitidia" },
      {
        property: "og:description",
        content: "Puntúa el servicio de limpieza recibido y deja un comentario para el equipo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ValorarPage,
});

function ValorarPage() {
  const { id } = Route.useParams();
  const db = useDB();
  const servicio = db.servicios.find((s) => s.id === id);
  const cliente = servicio ? db.clientes.find((c) => c.id === servicio.clienteId) : undefined;

  const [puntuacion, setPuntuacion] = useState(5);
  const [comentario, setComentario] = useState("");

  function enviar() {
    if (!servicio || servicio.valoracion) return;
    const texto = comentario.trim();
    const valoracion = {
      puntuacion,
      ...(texto ? { comentario: texto } : {}),
      fecha: new Date().toISOString().slice(0, 10),
    };
    setDB((prev) => ({
      ...prev,
      servicios: prev.servicios.map((s) => (s.id === id ? { ...s, valoracion } : s)),
    }));
  }

  return (
    <main className="fondo-fresco flex min-h-screen items-center justify-center px-4 py-12">
      <div className="superficie w-full max-w-lg p-8">
        <Logo />

        {!servicio || !cliente ? (
          <div className="mt-8">
            <h1 className="font-display text-2xl font-semibold text-foreground">
              Enlace no válido
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              No hemos encontrado el servicio que quieres valorar. Comprueba el enlace recibido.
            </p>
          </div>
        ) : servicio.valoracion ? (
          <div className="mt-8 text-center">
            <CheckCircle2 className="mx-auto size-12 text-exito" />
            <h1 className="font-display mt-4 text-2xl font-semibold text-foreground">
              ¡Gracias por tu valoración!
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Ya hemos registrado tu opinión sobre el servicio del {fechaLarga(servicio.fecha)}.
            </p>
            <div className="mt-4 flex justify-center">
              <Estrellas valor={servicio.valoracion.puntuacion} tamano={24} />
            </div>
            {servicio.valoracion.comentario ? (
              <p className="mt-3 text-sm italic text-muted-foreground">
                “{servicio.valoracion.comentario}”
              </p>
            ) : null}
          </div>
        ) : (
          <div className="mt-8">
            <h1 className="font-display text-2xl font-semibold text-foreground">
              ¿Cómo ha ido la limpieza?
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {cliente.nombre} · servicio del {fechaLarga(servicio.fecha)} a las {servicio.hora}
            </p>

            <div className="mt-6">
              <p className="text-sm font-medium text-foreground">Tu puntuación</p>
              <div className="mt-2">
                <Estrellas valor={puntuacion} onSelect={setPuntuacion} tamano={32} />
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="comentario" className="text-sm font-medium text-foreground">
                Comentario (opcional)
              </label>
              <Textarea
                id="comentario"
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Cuéntanos qué tal ha quedado todo…"
                className="mt-2"
                rows={4}
              />
            </div>

            <Button className="mt-6 w-full" onClick={enviar}>
              Enviar valoración
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
