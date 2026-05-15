"use client";

import { useState } from "react";
import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
import { servicios } from "@/lib/serviciosData";

export default function ServiciosTabs() {
  const [activeTab, setActiveTab] = useState(0);
  const [activeSubTab, setActiveSubTab] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    setActiveSubTab(0);
  };

  const servicio = servicios[activeTab];
  const subTab = servicio.subTabs?.[activeSubTab];
  const imageFailed = imageErrors[servicio.id];

  return (
    <div className="mb-16">
      <div
        role="tablist"
        aria-label="Categorías de servicio"
        className="mb-8 flex gap-3 overflow-x-auto whitespace-nowrap pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {servicios.map((s, index) => {
          const isActive = index === activeTab;
          return (
            <button
              key={s.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${s.id}`}
              id={`tab-${s.id}`}
              onClick={() => handleTabChange(index)}
              className={`flex-shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary text-gray-900"
                  : "border border-white/5 bg-[#18181B] text-muted hover:text-primary"
              }`}
            >
              {s.tabLabel}
            </button>
          );
        })}
      </div>

      <ScrollReveal key={servicio.id}>
        <div
          role="tabpanel"
          id={`panel-${servicio.id}`}
          aria-labelledby={`tab-${servicio.id}`}
          className="grid gap-8 lg:grid-cols-2 lg:gap-12"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-[#27272A] to-[#18181B]" />
            {!imageFailed && (
              <Image
                src={servicio.image}
                alt={servicio.imageAlt}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
                onError={() =>
                  setImageErrors((prev) => ({ ...prev, [servicio.id]: true }))
                }
              />
            )}
          </div>

          <div className="flex flex-col rounded-2xl border border-white/5 bg-[#18181b] p-8">
            <h2 className="mb-6 font-[family-name:var(--font-montserrat)] text-2xl font-bold text-white">
              {servicio.title}
            </h2>

            {servicio.subTabs && subTab && (
              <>
                <div className="mb-5 flex flex-wrap gap-2">
                  {servicio.subTabs.map((st, idx) => {
                    const isActiveSub = idx === activeSubTab;
                    return (
                      <button
                        key={st.label}
                        role="tab"
                        aria-selected={isActiveSub}
                        onClick={() => setActiveSubTab(idx)}
                        className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                          isActiveSub
                            ? "bg-primary text-gray-900"
                            : "border border-white/5 bg-[#0f0f10] text-muted hover:text-primary"
                        }`}
                      >
                        {st.label}
                      </button>
                    );
                  })}
                </div>

                {subTab.meta && subTab.meta.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {subTab.meta.map((m) => (
                      <span
                        key={m}
                        className="inline-flex rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                )}

                {subTab.title && (
                  <p className="mb-2 text-sm font-semibold leading-relaxed text-white">
                    {subTab.title}
                  </p>
                )}

                <p
                  className={`${subTab.items && subTab.items.length > 0 ? "mb-4" : "mb-8 flex-grow"} text-sm leading-relaxed text-gray-400`}
                >
                  {subTab.description}
                </p>

                {subTab.items && subTab.items.length > 0 && (
                  <ul className="mb-8 flex-grow space-y-3 pl-2">
                    {subTab.items.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm leading-relaxed text-gray-400"
                      >
                        <span aria-hidden className="mt-0.5 select-none text-primary">
                          –
                        </span>
                        <span>
                          <strong className="font-semibold text-white">
                            {item.bold}
                          </strong>
                          {item.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}

            {servicio.intro && (
              <p className="mb-6 text-sm leading-relaxed text-gray-400">
                {servicio.intro}
              </p>
            )}

            {servicio.bullets && servicio.bullets.length > 0 && (
              <ul className="mb-8 flex-grow space-y-3">
                {servicio.bullets.map((b, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-sm leading-relaxed text-gray-400"
                  >
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary/60" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}

            {!servicio.subTabs && !servicio.bullets && servicio.intro && (
              <div className="flex-grow" />
            )}

            <a
              href="/#formulario"
              className="block rounded-full border border-primary py-3 text-center text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-gray-900"
            >
              Solicitar información →
            </a>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
