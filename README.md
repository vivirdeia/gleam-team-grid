# Nitidia · Plantilla SaaS multi-tenant para empresas de limpieza

Nitidia es una **plantilla SaaS remix-ready** para empresas de limpieza de hogares y oficinas.
Cubre el ciclo completo del negocio: clientes y direcciones con datos de acceso, cuadrillas,
planificación semanal, checklist operativo con fotos, valoración del cliente por link público,
facturación recurrente y un panel de super administración del propio SaaS.

Todo funciona **100 % en el navegador con `localStorage`**: no hay backend, ni base de datos, ni
claves de API. Puedes remixarla, abrirla y probarla al instante con datos demo realistas en español.

---

## 1. Qué incluye

| Área | Qué hace |
| --- | --- |
| Landing comercial (`/`) | Hero, funcionalidades, planes reales, testimonios, CTA y footer |
| Registro (`/registro`) | Alta de una empresa nueva + siembra automática de datos demo propios |
| Login (`/login`) | Dos niveles: super admin del SaaS o empresa cliente (admin / cuadrilla, con PIN) |
| Panel de empresa (`/app`) | KPIs del día, servicios, ingresos y actividad reciente |
| Clientes (`/app/clientes`) | Hogares y oficinas, accesos (portero, llaves, alarma), frecuencia, tarifa y **límites por plan** |
| Cuadrillas (`/app/cuadrillas`) | Equipos, responsable, zona, disponibilidad y PIN de acceso |
| Planificación (`/app/planificacion`) | Calendario semanal por cuadrilla y alta de servicios |
| Facturación (`/app/facturacion`) | Generación de facturas recurrentes mensuales a partir de servicios completados |
| Mis servicios (`/app/mis-servicios`) | Vista móvil de la cuadrilla: ruta del día y próximos servicios |
| Checklist (`/app/servicio/$id`) | Tareas por áreas, fotos, notas y cierre del servicio |
| Valoración pública (`/valorar/$id`) | Link sin login para que el cliente puntúe el servicio |
| Super admin (`/app/saas`, `/app/saas/$id`) | Métricas globales, listado de empresas y activación / desactivación real de tenants |

---

## 2. Arquitectura

- **Stack**: TanStack Start v1 (React 19 + Vite 7), Tailwind CSS v4, shadcn/ui, lucide-react, sonner.
- **Sin backend**: toda la persistencia vive en `localStorage`.
  - `nitidia.db.v2` → base de datos completa (`empresas`, `clientes`, `cuadrillas`, `servicios`, `facturas`).
  - `nitidia.sesion.v2` → sesión simulada del usuario actual.
- **Rutas de `/app` con `ssr: false`**: son pantallas de aplicación que leen del navegador.

### Estructura de carpetas relevante

```text
src/
  lib/nitidia/
    types.ts        modelo de datos + PLANES + tipos de sesión
    seed.ts         3 empresas demo completas y realistas
    store.ts        acceso a localStorage, sesión y helpers de tenant
    onboarding.ts   alta dinámica de una empresa nueva con datos demo
    facturacion.ts  generación de facturas recurrentes
  components/nitidia/
    ui.tsx          Logo/Isotipo, pills, stats, estrellas, atribución
    decor.tsx       Reveal (scroll), blobs y patrones decorativos
  routes/           landing, login, registro, valorar y todo /app
```

### Modelo multi-tenant

Cada `Cliente`, `Cuadrilla`, `Servicio` y `Factura` lleva un campo `tenantId` que apunta a una
`Empresa`. El acceso a datos está acotado por tenant en el store:

- `getTenantDB(tenantId)` / `useTenantDB()` → devuelven **solo** los datos de ese tenant.
- `setTenantDB(tenantId, fn)` → escribe forzando el `tenantId` correcto.
- `getDB()` / `setDB()` → acceso global, reservado al **super admin del SaaS**.

La sesión tiene dos niveles:

```ts
{ nivel: "saas",  nombre }                              // super admin del SaaS, ve todos los tenants
{ nivel: "tenant", tenantId, rol: "admin" | "cuadrilla" } // usuario dentro de UNA empresa
```

Una sesión de tenant nunca puede leer ni escribir datos de otra empresa; una sesión SaaS no ve el
panel operativo de ninguna empresa, sino el panel de gestión del SaaS.

### Planes y límites

Definidos en `src/lib/nitidia/types.ts`:

| Plan | Precio | Límite de clientes |
| --- | --- | --- |
| Prueba gratis | 0 €/mes | 10 |
| Starter | 39 €/mes | 50 |
| Pro | 99 €/mes | 500 |

Al alcanzar el límite, `/app/clientes` bloquea la creación y muestra el aviso de mejora de plan.

---

## 3. Cómo probar cada rol (credenciales demo)

Entra por `/login`. Todo es simulado: no hay usuarios reales ni contraseñas seguras.

### Super admin del SaaS
- Elige **"Soy super admin del SaaS"** y entra. No requiere PIN.
- Verás `/app/saas`: métricas globales, listado de empresas y toggle de activación.
- Al desactivar una empresa, sus usuarios quedan bloqueados en el login hasta reactivarla.
- Solo el super admin puede **restaurar los datos de demo** (icono en la cabecera).

### Admin de empresa (PIN de administración)

| Empresa | Plan | PIN admin |
| --- | --- | --- |
| Brillo Madrid Servicios | Pro | `1234` |
| Clara Levante Limpiezas | Starter | `2345` |
| NorteLimp Bilbao | Prueba gratis | `3456` |

Elige **"Soy una empresa cliente"** → la empresa → perfil **Administración** → PIN.

### Cuadrilla (PIN de cuadrilla)

Mismo flujo, eligiendo una cuadrilla en lugar de Administración. PINs demo: `1111`, `2222`, `3333`.
La cuadrilla solo ve `/app/mis-servicios` y el checklist de sus servicios (pensado para móvil).

### Empresa nueva
En `/registro` das de alta una empresa: se crea el tenant con plan de prueba y se siembran
automáticamente 2 cuadrillas y 4 clientes de ejemplo. Aparecerá luego en la lista de `/login`
(PIN admin `1234` por defecto para las empresas creadas desde el registro).

### Valoración pública
Abre `/valorar/<idDelServicio>` (por ejemplo desde el detalle del servicio, botón de copiar link).
No requiere login y solo admite una valoración por servicio.

---

## 4. Restablecer los datos

Los datos demo se resiembran solos la primera vez. Para volver al estado inicial:

- Entra como super admin y pulsa el icono de **restaurar demo**, o
- borra las claves `nitidia.db.v2` y `nitidia.sesion.v2` del `localStorage`.

---

## 5. Migrar a un backend real (Supabase / Lovable Cloud)

La plantilla está pensada para que el salto a producción sea mecánico:

1. **Activa Lovable Cloud (Supabase)** en el proyecto.
2. **Crea las tablas** espejo de `types.ts`: `empresas`, `clientes`, `cuadrillas`, `servicios`,
   `facturas`. Mantén `tenant_id` en todas menos en `empresas`.
3. **Autenticación real**: sustituye la sesión simulada por Supabase Auth. Guarda el `tenant_id`
   y el rol del usuario en una tabla `perfiles` y los roles en una tabla `user_roles` aparte
   (nunca en el perfil, para evitar escaladas de privilegios).
4. **RLS por tenant**: activa Row Level Security y crea políticas del tipo
   `tenant_id = (select tenant_id from perfiles where id = auth.uid())`, más una función
   `has_role(auth.uid(), 'super_admin')` de tipo `security definer` para el acceso global del SaaS.
   Recuerda los `GRANT` a `authenticated` / `service_role` en cada tabla nueva.
5. **Sustituye el store**: `src/lib/nitidia/store.ts` es el único punto de acceso a los datos.
   Cambia `getTenantDB` / `setTenantDB` por consultas a Supabase (o server functions de TanStack
   Start) manteniendo la misma firma; las pantallas no necesitan cambios estructurales.
6. **Fotos del checklist**: hoy son data URLs en `localStorage`. Pásalas a Supabase Storage y
   guarda solo la URL pública.
7. **Facturación y pagos**: `facturacion.ts` genera facturas en cliente. En producción conviene
   moverlo a una server function programada y, si se cobra de verdad, integrar Stripe con el plan
   del tenant (`PLANES`) y aplicar los límites en el servidor, no solo en la UI.

---

## 6. Créditos

Un producto de [Vivir de IA](https://vivirdeia.com) · creado por
[Isaac Wesley](https://linkedin.com/in/isaacwesleey).
