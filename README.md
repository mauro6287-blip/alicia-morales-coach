# Alicia Morales Coach 🌟

Landing page profesional para servicios de coaching de desarrollo personal.

## Stack Tecnológico

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Tipografías**: Inter + Playfair Display
- **Deploy**: Export estático (Hostinger compatible)

## Estructura del Proyecto

```
├── app/
│   ├── layout.tsx        # Layout con SEO + Header/Footer
│   ├── page.tsx          # Página principal
│   └── globals.css       # Design tokens
├── components/
│   ├── Header.tsx        # Navegación sticky
│   ├── Footer.tsx        # Footer con contacto
│   └── ui/               # Componentes reutilizables
├── sections/             # 10 secciones de landing
│   ├── Hero.tsx
│   ├── Problemas.tsx
│   ├── PropuestaValor.tsx
│   ├── Servicios.tsx
│   ├── ComoTrabajo.tsx
│   ├── ParaQuienEs.tsx
│   ├── Resultados.tsx
│   ├── SobreMi.tsx
│   ├── Contacto.tsx
│   └── CTAFinal.tsx
└── public/
    ├── robots.txt
    └── sitemap.xml
```

## Comandos

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Los archivos estáticos se generan en /out
```

## Deploy en Hostinger

1. Ejecutar `npm run build`
2. Subir contenido de `/out` a `public_html`
3. Configurar dominio y SSL

## Características

- ✅ Diseño responsive
- ✅ SEO optimizado
- ✅ Formulario de contacto (mailto)
- ✅ Animaciones suaves
- ✅ Dark mode ready

---

**Versión**: 1.0.0  
**Fecha**: Febrero 2026
