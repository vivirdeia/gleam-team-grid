import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EstadoFacturaPill, Stat, TituloSeccion } from "@/components/nitidia/ui";
import { generarFacturasPeriodo, periodoDe } from "@/lib/nitidia/facturacion";
import { euros, fechaCorta, hoyISO, setDB, setTenantDB, useTenantDB } from "@/lib/nitidia/store";
import type { EstadoFactura } from "@/lib/nitidia/types";

export const Route = createFileRoute("/app/facturacion")({
  head: () => ({
    meta: [
      { title: "Facturación recurrente · Nitidia" },
      {
        name: "description",
        content: "Genera facturas automáticas según la frecuencia contratada y sigue el historial de pagos.",
      },
      { property: "og:title", content: "Facturación recurrente · Nitidia" },
      { property: "og:description", content: "Facturas por periodo, estado de pago e historial." },
    ],
  }),
  component: Facturacion,
});

function Facturacion() {
  const db = useTenantDB();
  const [filtro, setFiltro] = useState<"todas" | EstadoFactura>("todas");
  const periodo = periodoDe(hoyISO());

  const facturas = db.facturas
    .filter((f) => filtro === "todas" || f.estado === filtro)
    .sort((a, b) => (b.emision > a.emision ? 1 : -1));

  const cobrado = db.facturas.filter((f) => f.estado === "pagada").reduce((t, f) => t + f.total, 0);
  const pendiente = db.facturas
    .filter((f) => f.estado === "pendiente")
    .reduce((t, f) => t + f.total, 0);
  const ticket = db.facturas.length ? (cobrado + pendiente) / db.facturas.length : 0;

  function generar() {
    setDB((prev) => generarFacturasPeriodo(prev, periodo, db.empresa.id));
    toast.success("Facturación del periodo generada");
  }

  function marcarPagada(id: string) {
    setTenantDB(db.empresa.id, (v) => ({
      facturas: v.facturas.map((f) =>
        f.id === id ? { ...f, estado: "pagada" as EstadoFactura, pagadaEl: hoyISO() } : f,
      ),
    }));
    toast.success("Factura marcada como pagada");
  }

  return (
    <>
      <TituloSeccion
        titulo="Facturación"
        descripcion="Facturas recurrentes generadas a partir de los servicios completados"
        accion={
          <Button onClick={generar}>
            <RefreshCw className="size-4" /> Generar facturas de {periodo}
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat etiqueta="Cobrado" valor={euros(cobrado)} detalle="Facturas pagadas" />
        <Stat etiqueta="Pendiente de cobro" valor={euros(pendiente)} detalle="Facturas abiertas" />
        <Stat etiqueta="Ticket medio" valor={euros(ticket)} detalle="Por factura emitida" />
      </div>

      <div className="mt-6 mb-4 flex gap-1 rounded-lg border border-border bg-card p-1 sm:w-fit">
        {(["todas", "pendiente", "pagada"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFiltro(t)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
              filtro === t ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            {t === "todas" ? "Todas" : t === "pagada" ? "Pagadas" : "Pendientes"}
          </button>
        ))}
      </div>

      <div className="superficie overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-left text-xs text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-3">Factura</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Periodo</th>
              <th className="px-4 py-3">Servicios</th>
              <th className="px-4 py-3">Vencimiento</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {facturas.map((f) => (
              <tr key={f.id} className="hover:bg-muted/40">
                <td className="px-4 py-3 font-medium">
                  <span className="flex items-center gap-2">
                    <FileText className="size-4 text-muted-foreground" />
                    {f.numero}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {db.clientes.find((c) => c.id === f.clienteId)?.nombre ?? "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{f.periodo}</td>
                <td className="px-4 py-3 text-muted-foreground">{f.servicios.length}</td>
                <td className="px-4 py-3 text-muted-foreground">{fechaCorta(f.vencimiento)}</td>
                <td className="px-4 py-3 text-right font-semibold">
                  {euros(f.total)}
                  <span className="block text-[11px] font-normal text-muted-foreground">
                    base {euros(f.base)} + IVA
                  </span>
                </td>
                <td className="px-4 py-3">
                  <EstadoFacturaPill estado={f.estado} />
                  {f.pagadaEl ? (
                    <span className="mt-1 block text-[11px] text-muted-foreground">
                      {fechaCorta(f.pagadaEl)}
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-right">
                  {f.estado === "pendiente" ? (
                    <Button size="sm" variant="outline" onClick={() => marcarPagada(f.id)}>
                      Marcar pagada
                    </Button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {facturas.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">No hay facturas con este filtro.</p>
        ) : null}
      </div>
    </>
  );
}
