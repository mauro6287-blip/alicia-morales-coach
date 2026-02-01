# Skill: Diseño Responsivo Global para Móviles en Antigravity

## 📱 Introducción

Este skill te proporcionará las competencias necesarias para implementar un diseño responsivo móvil como aspecto global en Antigravity, asegurando que todas las páginas y pestañas se adapten perfectamente a dispositivos móviles.

---

## 🎯 Objetivos del Skill

- Establecer una base sólida de diseño responsivo global
- Implementar estrategias mobile-first en Antigravity
- Configurar breakpoints y media queries eficientes
- Optimizar la experiencia de usuario en dispositivos móviles
- Crear un sistema escalable y mantenible

---

## 📚 1. Conceptos Fundamentales

### 1.1 Principios del Diseño Responsivo

El diseño responsivo se basa en tres pilares fundamentales:

- **Layouts flexibles**: Uso de unidades relativas (%, em, rem, vw, vh)
- **Media queries**: Aplicación condicional de estilos según características del dispositivo
- **Imágenes escalables**: Contenido multimedia que se adapta al contenedor

### 1.2 Filosofía Mobile-First

```css
/* ✅ Correcto: Mobile-First */
.container {
  width: 100%;
  padding: 1rem;
}

@media (min-width: 768px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
}

/* ❌ Incorrecto: Desktop-First */
.container {
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 767px) {
  .container {
    width: 100%;
    padding: 1rem;
  }
}
```

---

## ⚙️ 2. Configuración Global en Antigravity

### 2.1 Estructura de Configuración

```javascript
// antigravity.config.js
export default {
  responsive: {
    enabled: true,
    strategy: 'mobile-first',
    breakpoints: {
      xs: '0px',
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      xxl: '1400px'
    },
    globalStyles: {
      enableFluidTypography: true,
      enableFlexboxUtils: true,
      enableGridUtils: true
    }
  }
}
```

### 2.2 Inicialización Global

```javascript
// main.js
import { Antigravity } from 'antigravity';
import responsiveConfig from './config/responsive.config.js';

const app = new Antigravity({
  responsive: responsiveConfig,
  globalCSS: true,
  mobileOptimizations: true
});

app.init();
```

---

## 🖥️ 3. Configuración del Viewport

### 3.1 Meta Viewport

```html
<!-- Configuración recomendada para Antigravity -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no, user-scalable=yes, maximum-scale=5.0">
```

### 3.2 Configuración Dinámica

```javascript
// viewport.js - Configuración dinámica del viewport
export class ViewportManager {
  constructor() {
    this.setViewport();
    this.handleOrientationChange();
  }

  setViewport() {
    const viewport = document.querySelector('meta[name="viewport"]');
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isIOS) {
      viewport.content = 'width=device-width, initial-scale=1.0, viewport-fit=cover';
    }
  }

  handleOrientationChange() {
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.adjustViewport();
      }, 500);
    });
  }

  adjustViewport() {
    const currentScale = window.visualViewport?.scale || 1;
    if (currentScale !== 1) {
      window.scrollTo(0, 0);
    }
  }
}
```

---

## 📏 4. Sistema de Breakpoints

### 4.1 Definición de Breakpoints

```scss
// _breakpoints.scss
$breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
  xxl: 1400px
) !default;

$grid-breakpoints: $breakpoints;
```

### 4.2 Mixins para Media Queries

```scss
// _mixins.scss
@mixin respond-to($breakpoint) {
  @if map-has-key($breakpoints, $breakpoint) {
    @media (min-width: map-get($breakpoints, $breakpoint)) {
      @content;
    }
  } @else {
    @warn "Breakpoint '#{$breakpoint}' not found in $breakpoints.";
  }
}

@mixin respond-between($min, $max) {
  $min-width: map-get($breakpoints, $min);
  $max-width: map-get($breakpoints, $max) - 1px;
  
  @media (min-width: $min-width) and (max-width: $max-width) {
    @content;
  }
}
```

### 4.3 Uso Práctico

```scss
.navigation {
  display: none;
  
  @include respond-to(md) {
    display: flex;
    justify-content: space-between;
  }
  
  @include respond-between(sm, md) {
    display: block;
    text-align: center;
  }
}
```

---

## 🎨 5. Estrategias CSS Responsivas

### 5.1 Sistema de Clases Utilitarias

```scss
// _utilities.scss
@each $breakpoint-name, $breakpoint-value in $breakpoints {
  @if $breakpoint-value == 0 {
    @include generate-utilities('');
  } @else {
    @media (min-width: $breakpoint-value) {
      @include generate-utilities('-#{$breakpoint-name}');
    }
  }
}

@mixin generate-utilities($suffix) {
  // Display utilities
  .d-none#{$suffix} { display: none !important; }
  .d-block#{$suffix} { display: block !important; }
  .d-flex#{$suffix} { display: flex !important; }
  .d-grid#{$suffix} { display: grid !important; }
  
  // Flexbox utilities
  .flex-row#{$suffix} { flex-direction: row !important; }
  .flex-column#{$suffix} { flex-direction: column !important; }
  .justify-start#{$suffix} { justify-content: flex-start !important; }
  .justify-center#{$suffix} { justify-content: center !important; }
  .justify-between#{$suffix} { justify-content: space-between !important; }
}
```

### 5.2 Container Responsivo

```scss
.container {
  width: 100%;
  padding-right: 1rem;
  padding-left: 1rem;
  margin-right: auto;
  margin-left: auto;

  @include respond-to(sm) {
    max-width: 540px;
  }

  @include respond-to(md) {
    max-width: 720px;
  }

  @include respond-to(lg) {
    max-width: 960px;
  }

  @include respond-to(xl) {
    max-width: 1140px;
  }

  @include respond-to(xxl) {
    max-width: 1320px;
  }
}

.container-fluid {
  width: 100%;
  padding-right: 1rem;
  padding-left: 1rem;
  margin-right: auto;
  margin-left: auto;
}
```

---

## 📐 6. Layouts Flexibles

### 6.1 Sistema de Grid Flexbox

```scss
// _grid.scss
.row {
  display: flex;
  flex-wrap: wrap;
  margin-right: -0.75rem;
  margin-left: -0.75rem;
}

.col {
  flex: 1 0 0%;
  padding-right: 0.75rem;
  padding-left: 0.75rem;
}

@for $i from 1 through 12 {
  .col-#{$i} {
    flex: 0 0 auto;
    width: percentage($i / 12);
    padding-right: 0.75rem;
    padding-left: 0.75rem;
  }
}

@each $breakpoint-name, $breakpoint-value in $breakpoints {
  @if $breakpoint-value > 0 {
    @media (min-width: $breakpoint-value) {
      @for $i from 1 through 12 {
        .col-#{$breakpoint-name}-#{$i} {
          flex: 0 0 auto;
          width: percentage($i / 12);
        }
      }
    }
  }
}
```

### 6.2 CSS Grid Responsivo

```scss
// _grid-css.scss
.grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;

  @include respond-to(sm) {
    grid-template-columns: repeat(2, 1fr);
  }

  @include respond-to(md) {
    grid-template-columns: repeat(3, 1fr);
  }

  @include respond-to(lg) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.grid-auto-fit {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.grid-auto-fill {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}
```

---

## 📝 7. Tipografía Escalable

### 7.1 Sistema de Tipografía Fluida

```scss
// _typography.scss
:root {
  --font-size-base: clamp(1rem, 2.5vw, 1.125rem);
  --font-size-sm: clamp(0.875rem, 2.2vw, 1rem);
  --font-size-lg: clamp(1.125rem, 2.8vw, 1.25rem);
  --font-size-xl: clamp(1.25rem, 3.2vw, 1.5rem);
  
  --line-height-base: 1.6;
  --line-height-sm: 1.4;
  --line-height-lg: 1.8;
}

// Headings responsivos
@for $i from 1 through 6 {
  h#{$i} {
    font-size: var(--h#{$i}-size);
    line-height: var(--heading-line-height);
    margin-bottom: 0.5em;
  }
}

:root {
  --h1-size: clamp(1.875rem, 4vw, 3rem);
  --h2-size: clamp(1.5rem, 3.5vw, 2.5rem);
  --h3-size: clamp(1.25rem, 3vw, 2rem);
  --h4-size: clamp(1.125rem, 2.5vw, 1.75rem);
  --h5-size: clamp(1rem, 2vw, 1.5rem);
  --h6-size: clamp(0.875rem, 1.8vw, 1.25rem);
  --heading-line-height: 1.2;
}
```

### 7.2 Clases Utilitarias de Texto

```scss
// Tamaños responsivos
.text-xs { font-size: clamp(0.75rem, 1.8vw, 0.875rem); }
.text-sm { font-size: var(--font-size-sm); }
.text-base { font-size: var(--font-size-base); }
.text-lg { font-size: var(--font-size-lg); }
.text-xl { font-size: var(--font-size-xl); }

// Alineación responsiva
@each $breakpoint-name, $breakpoint-value in $breakpoints {
  @if $breakpoint-value == 0 {
    @include generate-text-utilities('');
  } @else {
    @media (min-width: $breakpoint-value) {
      @include generate-text-utilities('-#{$breakpoint-name}');
    }
  }
}

@mixin generate-text-utilities($suffix) {
  .text-left#{$suffix} { text-align: left !important; }
  .text-center#{$suffix} { text-align: center !important; }
  .text-right#{$suffix} { text-align: right !important; }
}
```

---

## 🖼️ 8. Optimización de Imágenes

### 8.1 Imágenes Responsivas

```html
<!-- Imagen responsiva básica -->
<img src="https://example.com/image-mobile.jpg" 
     srcset="https://example.com/image-mobile.jpg 480w,
             https://example.com/image-tablet.jpg 768w,
             https://example.com/image-desktop.jpg 1200w"
     sizes="(max-width: 480px) 100vw,
            (max-width: 768px) 50vw,
            25vw"
     alt="Descripción de la imagen"
     loading="lazy">

<!-- Picture element para diferentes formatos -->
<picture>
  <source media="(max-width: 767px)" 
          srcset="https://example.com/mobile.webp" 
          type="image/webp">
  <source media="(max-width: 767px)" 
          srcset="https://example.com/mobile.jpg" 
          type="image/jpeg">
  <source srcset="https://example.com/desktop.webp" 
          type="image/webp">
  <img src="https://example.com/desktop.jpg" 
       alt="Descripción de la imagen">
</picture>
```

### 8.2 CSS para Imágenes Responsivas

```scss
// _images.scss
.img-responsive {
  max-width: 100%;
  height: auto;
  display: block;
}

.img-fluid {
  max-width: 100%;
  height: auto;
}

// Aspect ratio containers
.aspect-ratio {
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    display: block;
    padding-top: var(--aspect-ratio, 56.25%); // 16:9 por defecto
  }
  
  > * {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.aspect-1-1 { --aspect-ratio: 100%; }
.aspect-4-3 { --aspect-ratio: 75%; }
.aspect-16-9 { --aspect-ratio: 56.25%; }
.aspect-21-9 { --aspect-ratio: 42.857%; }
```

### 8.3 Lazy Loading Avanzado

```javascript
// lazyload.js
export class ResponsiveLazyLoad {
  constructor() {
    this.imageObserver = null;
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadImage(entry.target);
            this.imageObserver.unobserve(entry.target);
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        this.imageObserver.observe(img);
      });
    } else {
      // Fallback para navegadores sin soporte
      this.loadAllImages();
    }
  }

  loadImage(img) {
    img.src = img.dataset.src;
    img.classList.remove('lazy');
    img.classList.add('loaded');

    if (img.dataset.srcset) {
      img.srcset = img.dataset.srcset;
    }
  }

  loadAllImages() {
    document.querySelectorAll('img[data-src]').forEach(img => {
      this.loadImage(img);
    });
  }
}
```

---

## 👆 9. Interacciones Táctiles

### 9.1 Áreas de Toque Optimizadas

```scss
// _touch.scss
.touch-target {
  min-height: 44px; // iOS recommendation
  min-width: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  @include respond-to(md) {
    min-height: 40px;
    min-width: 40px;
  }
}

// Estados de interacción
.btn, .touch-target {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  
  &:active {
    transform: scale(0.98);
    transition: transform 0.1s ease;
  }
}

// Feedback visual mejorado
.tap-highlight {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
  
  &:focus {
    outline: 2px solid var(--focus-color);
    outline-offset: 2px;
  }
}
```

### 9.2 Gestos y Eventos Táctiles

```javascript
// touch-gestures.js
export class TouchGestureHandler {
  constructor(element) {
    this.element = element;
    this.startX = 0;
    this.startY = 0;
    this.endX = 0;
    this.endY = 0;
    this.threshold = 50;
    
    this.bindEvents();
  }

  bindEvents() {
    this.element.addEventListener('touchstart', this.handleTouchStart.bind(this));
    this.element.addEventListener('touchmove', this.handleTouchMove.bind(this));
    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this));
  }

  handleTouchStart(e) {
    this.startX = e.touches[0].clientX;
    this.startY = e.touches[0].clientY;
  }

  handleTouchMove(e) {
    if (!this.startX || !this.startY) return;
    
    this.endX = e.touches[0].clientX;
    this.endY = e.touches[0].clientY;
  }

  handleTouchEnd() {
    if (!this.startX || !this.startY) return;
    
    const deltaX = this.endX - this.startX;
    const deltaY = this.endY - this.startY;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > this.threshold) {
        if (deltaX > 0) {
          this.onSwipeRight();
        } else {
          this.onSwipeLeft();
        }
      }
    } else {
      if (Math.abs(deltaY) > this.threshold) {
        if (deltaY > 0) {
          this.onSwipeDown();
        } else {
          this.onSwipeUp();
        }
      }
    }
    
    this.reset();
  }

  reset() {
    this.startX = 0;
    this.startY = 0;
    this.endX = 0;
    this.endY = 0;
  }

  onSwipeLeft() { /* Implementar */ }
  onSwipeRight() { /* Implementar */ }
  onSwipeUp() { /* Implementar */ }
  onSwipeDown() { /* Implementar */ }
}
```

---

## 🧪 10. Estrategias de Testing

### 10.1 Testing Responsivo Automatizado

```javascript
// responsive-testing.js
export class ResponsiveTestSuite {
  constructor() {
    this.breakpoints = {
      mobile: { width: 375, height: 667 },
      tablet: { width: 768, height: 1024 },
      desktop: { width: 1200, height: 800 }
    };
  }

  async testAllBreakpoints() {
    const results = {};
    
    for (const [device, dimensions] of Object.entries(this.breakpoints)) {
      results[device] = await this.testBreakpoint(dimensions);
    }
    
    return results;
  }

  async testBreakpoint(dimensions) {
    // Simular cambio de viewport
    window.resizeTo(dimensions.width, dimensions.height);
    
    await this.waitForLayout();
    
    return {
      viewport: dimensions,
      layoutIssues: this.detectLayoutIssues(),
      performanceMetrics: this.measurePerformance(),
      accessibility: this.checkAccessibility()
    };
  }

  detectLayoutIssues() {
    const issues = [];
    
    // Verificar overflow horizontal
    if (document.documentElement.scrollWidth > window.innerWidth) {
      issues.push('Horizontal scroll detected');
    }
    
    // Verificar elementos muy pequeños
    document.querySelectorAll('button, a').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.width < 44 || rect.height < 44) {
        issues.push(`Touch target too small: ${el.tagName}`);
      }
    });
    
    return issues;
  }

  measurePerformance() {
    const perfEntries = performance.getEntriesByType('navigation')[0];
    return {
      loadTime: perfEntries.loadEventEnd - perfEntries.loadEventStart,
      domReady: perfEntries.domContentLoadedEventEnd - perfEntries.domContentLoadedEventStart,
      firstPaint: performance.getEntriesByType('paint')[0]?.startTime
    };
  }

  checkAccessibility() {
    const issues = [];
    
    // Verificar contrastes
    document.querySelectorAll('*').forEach(el => {
      const styles = getComputedStyle(el);
      const contrast = this.calculateContrast(styles.color, styles.backgroundColor);
      
      if (contrast < 4.5) {
        issues.push(`Low contrast detected in ${el.tagName}`);
      }
    });
    
    return issues;
  }

  waitForLayout() {
    return new Promise(resolve => {
      requestAnimationFrame(() => {
        requestAnimationFrame(resolve);
      });
    });
  }

  calculateContrast(color1, color2) {
    // Implementación simplificada del cálculo de contraste
    return 4.5; // Placeholder
  }
}
```

### 10.2 Herramientas de Debug Responsivo

```javascript
// responsive-debug.js
export class ResponsiveDebugger {
  constructor() {
    this.isActive = false;
    this.overlay = null;
    this.init();
  }

  init() {
    if (process.env.NODE_ENV === 'development') {
      this.createDebugOverlay();
      this.bindKeyboardShortcuts();
    }
  }

  createDebugOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.id = 'responsive-debugger';
    this.overlay.innerHTML = `
      <div class="debug-info">
        <span class="viewport-size"></span>
        <span class="breakpoint-info"></span>
        <span class="device-pixel-ratio"></span>
      </div>
      <div class="debug-grid"></div>
    `;
    
    this.overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
      display: none;
    `;
    
    document.body.appendChild(this.overlay);
    this.updateDebugInfo();
  }

  bindKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        this.toggle();
      }
    });
  }

  toggle() {
    this.isActive = !this.isActive;
    this.overlay.style.display = this.isActive ? 'block' : 'none';
    
    if (this.isActive) {
      window.addEventListener('resize', this.updateDebugInfo.bind(this));
    } else {
      window.removeEventListener('resize', this.updateDebugInfo.bind(this));
    }
  }

  updateDebugInfo() {
    const info = this.overlay.querySelector('.debug-info');
    const viewport = `${window.innerWidth}x${window.innerHeight}`;
    const breakpoint = this.getCurrentBreakpoint();
    const dpr = window.devicePixelRatio;
    
    info.innerHTML = `
      <span class="viewport-size">Viewport: ${viewport}</span>
      <span class="breakpoint-info">Breakpoint: ${breakpoint}</span>
      <span class="device-pixel-ratio">DPR: ${dpr}</span>
    `;
  }

  getCurrentBreakpoint() {
    const width = window.innerWidth;
    
    if (width >= 1400) return 'xxl';
    if (width >= 1200) return 'xl';
    if (width >= 992) return 'lg';
    if (width >= 768) return 'md';
    if (width >= 576) return 'sm';
    return 'xs';
  }
}
```

---

## 🎛️ 11. Patrones Comunes Responsivos

### 11.1 Navegación Responsiva

```scss
// _navigation.scss
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  
  .navbar-brand {
    flex-shrink: 0;
  }
  
  .navbar-toggle {
    display: block;
    background: none;
    border: none;
    padding: 0.25rem;
    cursor: pointer;
    
    @include respond-to(md) {
      display: none;
    }
  }
  
  .navbar-nav {
    position: fixed;
    top: 0;
    left: -100%;
    width: 80%;
    height: 100vh;
    background: white;
    flex-direction: column;
    padding: 2rem 1rem;
    transition: left 0.3s ease;
    z-index: 1000;
    
    &.open {
      left: 0;
    }
    
    @include respond-to(md) {
      position: static;
      width: auto;
      height: auto;
      flex-direction: row;
      padding: 0;
      background: transparent;
      left: auto;
    }
  }
  
  .nav-item {
    margin: 0.5rem 0;
    
    @include respond-to(md) {
      margin: 0 1rem;
    }
  }
}

// Overlay para menú móvil
.navbar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 999;
  
  &.open {
    opacity: 1;
    visibility: visible;
  }
  
  @include respond-to(md) {
    display: none;
  }
}
```

### 11.2 Cards Responsivas

```scss
// _cards.scss
.card-container {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;
  
  @include respond-to(sm) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @include respond-to(lg) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @include respond-to(xl) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    
    @media (hover: none) {
      transform: none;
    }
  }
  
  .card-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    
    @include respond-to(md) {
      height: 250px;
    }
  }
  
  .card-content {
    padding: 1rem;
    
    @include respond-to(md) {
      padding: 1.5rem;
    }
  }
  
  .card-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    line-height: 1.3;
  }
  
  .card-text {
    color: #666;
    line-height: 1.6;
    margin-bottom: 1rem;
  }
}
```

### 11.3 Formularios Responsivos

```scss
// _forms.scss
.form-group {
  margin-bottom: 1.5rem;
  
  .form-label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #333;
  }
  
  .form-control {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #ddd;
    border-radius: 0.375rem;
    font-size: 1rem;
    transition: border-color 0.15s ease;
    
    @include respond-to(md) {
      font-size: 0.875rem;
    }
    
    &:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }
    
    &.is-invalid {
      border-color: #dc3545;
    }
  }
  
  .form-text {
    font-size: 0.875rem;
    color: #6c757d;
    margin-top: 0.25rem;
  }
  
  .invalid-feedback {
    display: block;
    font-size: 0.875rem;
    color: #dc3545;
    margin-top: 0.25rem;
  }
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  @include respond-to(md) {
    flex-direction: row;
    
    .form-group {
      flex: 1;
    }
  }
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 2rem;
  
  @include respond-to(sm) {
    flex-direction: row;
    justify-content: flex-end;
  }
  
  .btn {
    order: 2;
    
    @include respond-to(sm) {
      order: initial;
      width: auto;
    }
    
    &.btn-primary {
      order: 1;
    }
  }
}
```

---

## ✅ 12. Best Practices y Optimizaciones

### 12.1 Performance Optimizations

```javascript
// performance-optimizer.js
export class ResponsivePerformanceOptimizer {
  constructor() {
    this.debouncedResize = this.debounce(this.handleResize.bind(this), 250);
    this.init();
  }

  init() {
    // Optimizar eventos de resize
    window.addEventListener('resize', this.debouncedResize);
    
    // Lazy load de componentes pesados
    this.initLazyComponents();
    
    // Preload de recursos críticos
    this.preloadCriticalResources();
    
    // Optimizar renderizado
    this.optimizeRenderPerformance();
  }

  handleResize() {
    // Actualizar variables CSS personalizadas
    this.updateViewportVariables();
    
    // Reajustar componentes que lo necesiten
    this.recalculateLayouts();
  }

  updateViewportVariables() {
    const root = document.documentElement;
    root.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    root.style.setProperty('--vw', `${window.innerWidth * 0.01}px`);
  }

  initLazyComponents() {
    // Cargar componentes solo cuando sean necesarios
    const heavyComponents = document.querySelectorAll('[data-lazy-component]');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadComponent(entry.target);
          observer.unobserve(entry.target);
        }
      });
    });

    heavyComponents.forEach(component => observer.observe(component));
  }

  preloadCriticalResources() {
    // Precargar imágenes above-the-fold
    const criticalImages = document.querySelectorAll('[data-critical]');
    criticalImages.forEach(img => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = img.dataset.src || img.src;
      document.head.appendChild(link);
    });
  }

  optimizeRenderPerformance() {
    // Usar transform en lugar de cambiar posición
    const animatedElements = document.querySelectorAll('.animate');
    animatedElements.forEach(el => {
      el.style.willChange = 'transform, opacity';
    });
    
    // Cleanup después de animaciones
    document.addEventListener('animationend', (e) => {
      e.target.style.willChange = 'auto';
    });
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  loadComponent(element) {
    const componentType = element.dataset.lazyComponent;
    import(`../components/${componentType}.js`).then(module => {
      new module.default(element);
    });
  }

  recalculateLayouts() {
    // Forzar recálculo solo cuando sea necesario
    const componentsToRecalculate = document.querySelectorAll('[data-recalculate-on-resize]');
    componentsToRecalculate.forEach(component => {
      component.dispatchEvent(new CustomEvent('resize-recalculate'));
    });
  }
}
```

### 12.2 Accesibilidad Responsiva

```scss
// _accessibility.scss
// Mejoras de accesibilidad específicas para móviles
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

// Skip links mejorados para móvil
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #000;
  color: #fff;
  padding: 8px;
  text-decoration: none;
  border-radius: 0 0 4px 4px;
  z-index: 9999;
  
  &:focus {
    top: 0;
  }
  
  @include respond-to(md) {
    left: 1rem;
  }
}

// Focus styles mejorados para dispositivos táctiles
:focus-visible {
  outline: 2px solid #005fcc;
  outline-offset: 2px;
  border-radius: 2px;
}

// Mejorar la visibilidad en modo alto contraste
@media (prefers-contrast: high) {
  .btn {
    border: 2px solid currentColor;
  }
  
  .card {
    border: 1px solid currentColor;
  }
}

// Respetar preferencias de movimiento reducido
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 12.3 Progressive Enhancement

```javascript
// progressive-enhancement.js
export class ProgressiveEnhancement {
  constructor() {
    this.features = {
      intersectionObserver: 'IntersectionObserver' in window,
      flexbox: this.supportsFlexbox(),
      grid: this.supportsGrid(),
      webp: false,
      touchEvents: 'ontouchstart' in window,
      hover: window.matchMedia('(hover: hover)').matches
    };
    
    this.init();
  }

  init() {
    // Detectar soporte para WebP
    this.detectWebPSupport().then(supported => {
      this.features.webp = supported;
      this.applyFeatureClasses();
    });
    
    this.applyFeatureClasses();
    this.setupFallbacks();
  }

  supportsFlexbox() {
    const test = document.createElement('div');
    test.style.display = 'flex';
    return test.style.display === 'flex';
  }

  supportsGrid() {
    const test = document.createElement('div');
    test.style.display = 'grid';
    return test.style.display === 'grid';
  }

  detectWebPSupport() {
    return new Promise(resolve => {
      const webp = new Image();
      webp.onload = webp.onerror = () => {
        resolve(webp.height === 2);
      };
      webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }

  applyFeatureClasses() {
    const html = document.documentElement;
    
    Object.entries(this.features).forEach(([feature, supported]) => {
      const className = supported ? `supports-${feature}` : `no-${feature}`;
      html.classList.add(className);
    });
  }

  setupFallbacks() {
    // Fallback para Grid
    if (!this.features.grid) {
      this.setupFlexboxGridFallback();
    }
    
    // Fallback para Intersection Observer
    if (!this.features.intersectionObserver) {
      this.setupScrollBasedLazyLoading();
    }
    
    // Fallback para eventos táctiles
    if (!this.features.touchEvents) {
      this.setupMouseEventFallbacks();
    }
  }

  setupFlexboxGridFallback() {
    const grids = document.querySelectorAll('.grid');
    grids.forEach(grid => {
      grid.classList.add('grid-fallback');
    });
  }

  setupScrollBasedLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const checkImages = () => {
      lazyImages.forEach(img => {
        if (this.isInViewport(img)) {
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          img.classList.add('loaded');
        }
      });
    };

    window.addEventListener('scroll', this.throttle(checkImages, 250));
    window.addEventListener('resize', this.throttle(checkImages, 250));
    checkImages();
  }

  setupMouseEventFallbacks() {
    // Convertir eventos táctiles a eventos de mouse
    document.addEventListener('mousedown', (e) => {
      e.target.dispatchEvent(new CustomEvent('touchstart', {
        bubbles: true,
        cancelable: true
      }));
    });
  }

  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}
```

---

## 🎯 13. Implementación Global

### 13.1 Estructura de Archivos

```
src/
├── styles/
│   ├── base/
│   │   ├── _reset.scss
│   │   ├── _typography.scss
│   │   └── _variables.scss
│   ├── layout/
│   │   ├── _grid.scss
│   │   ├── _containers.scss
│   │   └── _navigation.scss
│   ├── components/
│   │   ├── _buttons.scss
│   │   ├── _forms.scss
│   │   └── _cards.scss
│   ├── utilities/
│   │   ├── _spacing.scss
│   │   ├── _display.scss
│   │   └── _responsive.scss
│   └── main.scss
├── js/
│   ├── core/
│   │   ├── responsive-manager.js
│   │   ├── viewport-detector.js
│   │   └── breakpoint-manager.js
│   ├── components/
│   │   ├── responsive-navigation.js
│   │   ├── lazy-loader.js
│   │   └── touch-handler.js
│   └── main.js
└── config/
    ├── responsive.config.js
    └── breakpoints.config.js
```

### 13.2 Configuración Principal

```javascript
// main.js - Inicialización global del sistema responsivo
import { ResponsiveManager } from './core/responsive-manager.js';
import { ProgressiveEnhancement } from './utils/progressive-enhancement.js';
import { ResponsivePerformanceOptimizer } from './utils/performance-optimizer.js';
import { ResponsiveDebugger } from './utils/responsive-debugger.js';

class AntigravityResponsiveCore {
  constructor(config = {}) {
    this.config = {
      enableDebug: process.env.NODE_ENV === 'development',
      enablePerformanceOptimizations: true,
      enableProgressiveEnhancement: true,
      globalBreakpoints: true,
      ...config
    };
    
    this.components = new Map();
    this.init();
  }

  async init() {
    // Inicializar Progressive Enhancement
    if (this.config.enableProgressiveEnhancement) {
      this.progressiveEnhancement = new ProgressiveEnhancement();
    }
    
    // Inicializar optimizaciones de performance
    if (this.config.enablePerformanceOptimizations) {
      this.performanceOptimizer = new ResponsivePerformanceOptimizer();
    }
    
    // Inicializar manager responsivo
    this.responsiveManager = new ResponsiveManager(this.config);
    
    // Inicializar debugger en desarrollo
    if (this.config.enableDebug) {
      this.debugger = new ResponsiveDebugger();
    }
    
    // Registrar componentes
    await this.registerComponents();
    
    // Establecer listeners globales
    this.setupGlobalListeners();
    
    // Aplicar estilos globales
    this.applyGlobalStyles();
  }

  async registerComponents() {
    // Auto-registro de componentes responsivos
    const componentElements = document.querySelectorAll('[data-responsive-component]');
    
    for (const element of componentElements) {
      const componentType = element.dataset.responsiveComponent;
      try {
        const ComponentClass = await import(`./components/responsive-${componentType}.js`);
        const instance = new ComponentClass.default(element, this.config);
        this.components.set(element, instance);
      } catch (error) {
        console.warn(`Failed to load responsive component: ${componentType}`, error);
      }
    }
  }

  setupGlobalListeners() {
    // Listener global para cambios de orientación
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.handleOrientationChange();
      }, 100);
    });

    // Listener para cambios de breakpoint
    this.responsiveManager.on('breakpointChange', (breakpoint) => {
      this.handleBreakpointChange(breakpoint);
    });

    // Listener para visibility change (importante para performance)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseNonCriticalOperations();
      } else {
        this.resumeOperations();
      }
    });
  }

  applyGlobalStyles() {
    // Inyectar CSS custom properties dinámicas
    const root = document.documentElement;
    
    // Variables de viewport
    root.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    root.style.setProperty('--vw', `${window.innerWidth * 0.01}px`);
    
    // Variables de breakpoint actual
    const currentBreakpoint = this.responsiveManager.getCurrentBreakpoint();
    root.style.setProperty('--current-breakpoint', currentBreakpoint);
  }

  handleOrientationChange() {
    // Recalcular variables de viewport
    this.applyGlobalStyles();
    
    // Notificar a todos los componentes
    this.components.forEach(component => {
      if (component.handleOrientationChange) {
        component.handleOrientationChange();
      }
    });
  }

  handleBreakpointChange(breakpoint) {
    // Actualizar variable CSS
    document.documentElement.style.setProperty('--current-breakpoint', breakpoint);
    
    // Notificar a componentes
    this.components.forEach(component => {
      if (component.handleBreakpointChange) {
        component.handleBreakpointChange(breakpoint);
      }
    });
    
    // Emitir evento global
    window.dispatchEvent(new CustomEvent('antigravity:breakpointChange', {
      detail: { breakpoint }
    }));
  }

  pauseNonCriticalOperations() {
    this.components.forEach(component => {
      if (component.pause) {
        component.pause();
      }
    });
  }

  resumeOperations() {
    this.components.forEach(component => {
      if (component.resume) {
        component.resume();
      }
    });
  }

  // API pública para extensiones
  registerGlobalComponent(selector, ComponentClass) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      const instance = new ComponentClass(element, this.config);
      this.components.set(element, instance);
    });
  }

  getComponent(element) {
    return this.components.get(element);
  }

  destroy() {
    this.components.forEach(component => {
      if (component.destroy) {
        component.destroy();
      }
    });
    this.components.clear();
  }
}

// Inicialización automática
document.addEventListener('DOMContentLoaded', () => {
  window.AntigravityResponsive = new AntigravityResponsiveCore();
});

export default AntigravityResponsiveCore;
```

---

## 📋 14. Checklist de Implementación

### ✅ Configuración Base
- [ ] Configurar meta viewport
- [ ] Establecer breakpoints globales
- [ ] Configurar sistema de grid
- [ ] Implementar container responsivo

### ✅ Estilos Responsivos
- [ ] Aplicar estrategia mobile-first
- [ ] Configurar tipografía escalable
- [ ] Implementar utilitarias responsivas
- [ ] Optimizar imágenes para dispositivos

### ✅ JavaScript
- [ ] Implementar detection de características
- [ ] Configurar lazy loading
- [ ] Añadir soporte para gestos táctiles
- [ ] Implementar optimizaciones de performance

### ✅ Testing
- [ ] Probar en dispositivos reales
- [ ] Validar accesibilidad
- [ ] Verificar performance
- [ ] Comprobar compatibilidad

### ✅ Optimización
- [ ] Minificar CSS y JS
- [ ] Optimizar imágenes
- [ ] Configurar caching
- [ ] Implementar service worker

---

## 🚀 Conclusión

Este skill te proporciona una base sólida para implementar diseño responsivo global en Antigravity. La arquitectura propuesta es escalable, mantenible y optimizada para performance, asegurando una experiencia de usuario excepcional en todos los dispositivos.

### Próximos Pasos
1. Implementar la configuración base
2. Personalizar los breakpoints según tus necesidades
3. Añadir componentes específicos de tu proyecto
4. Realizar testing exhaustivo
5. Optimizar basado en métricas reales

### Recursos Adicionales
- [MDN Web Docs - Responsive Design](https://developer.mozilla.org/es/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Web.dev - Responsive Web Design](https://web.dev/responsive-web-design-basics/)
- [Can I Use - CSS Features](https://caniuse.com/)

---

*¡Felicidades! Ahora tienes las herramientas necesarias para crear experiencias responsivas excepcionales en Antigravity.*