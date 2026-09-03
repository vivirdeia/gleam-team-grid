import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Revela su contenido con fade + slide cuando entra en el viewport. */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "article" | "li" | "figure";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) {
            setVisible(true);
            obs.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn("revelable", visible && "revelado", className)}
    >
      {children}
    </Tag>
  );
}

/** Manchas orgánicas de fondo (decorativas). */
export function Blobs({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      <svg
        className="absolute -top-28 -right-24 size-[34rem] opacity-60 flotar"
        viewBox="0 0 200 200"
      >
        <path
          fill="oklch(0.9 0.06 195 / 0.65)"
          d="M43.6,-58.6C56.4,-50.9,66.4,-37.7,70.3,-23.1C74.2,-8.5,72.1,7.6,66.1,21.7C60.1,35.8,50.3,47.9,37.7,56.6C25.1,65.4,9.7,70.7,-5.6,69.9C-20.9,69.1,-36.1,62.1,-48.3,51.6C-60.5,41.1,-69.6,27,-72.6,11.6C-75.6,-3.8,-72.4,-20.5,-63.6,-33.3C-54.8,-46.2,-40.3,-55.2,-26.1,-61.9C-11.8,-68.6,2.1,-73.1,15.6,-71.2C29,-69.3,30.8,-66.2,43.6,-58.6Z"
          transform="translate(100 100)"
        />
      </svg>
      <svg
        className="absolute -bottom-40 -left-32 size-[30rem] opacity-50 flotar-lento"
        viewBox="0 0 200 200"
      >
        <path
          fill="oklch(0.93 0.055 168 / 0.7)"
          d="M38.4,-52.9C50.9,-45.3,62.5,-35.5,67.9,-22.6C73.3,-9.7,72.4,6.4,66.7,20C61,33.7,50.4,44.9,38,53.3C25.6,61.7,11.5,67.3,-3.3,71.1C-18,74.9,-33.4,76.9,-45.5,70.5C-57.6,64.1,-66.4,49.4,-70.9,34.1C-75.5,18.7,-75.8,2.8,-71.4,-11.1C-67,-25,-58,-36.9,-46.4,-45.1C-34.8,-53.3,-20.6,-57.8,-6.6,-59.2C7.4,-60.6,25.9,-60.5,38.4,-52.9Z"
          transform="translate(100 100)"
        />
      </svg>
    </div>
  );
}

/** Patrón de puntos sutil para separar secciones. */
export function PatronPuntos({ className }: { className?: string }) {
  return <div aria-hidden className={cn("patron-puntos pointer-events-none absolute inset-0", className)} />;
}
