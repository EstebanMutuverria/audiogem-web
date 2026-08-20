# PRD — AUDIO GEM E-commerce Web (Estado Actual Implementado)

> **Versión:** 1.0 (Documentación de lo existente)  
> **Fecha:** 2026-08-20  
> **Stack:** React 19 + Vite 7 + React Router v7 (SPA)  
> **Estado:** **PRODUCCIÓN** — Sitio funcional y desplegado

---

## 1. Resumen Ejecutivo

**AUDIO GEM** es un e-commerce informativo de **audio para vehículos** ya desarrollado y en producción. El sitio permite:

- Explorar catálogo de **65 productos** distribuidos en **7 categorías**
- Filtrar por categoría, ver fichas con especificaciones (peso, dimensiones)
- **Carrito de compras persistente** (localStorage) con gestión de cantidades
- **Checkout por WhatsApp**: genera mensaje estructurado con el pedido completo y abre `wa.me`
- Formulario de contacto funcional (Formspree) + info de contacto + mapa embebido
- Página "Nosotros" con historia y valores
- Panel de administración básico
- Botón flotante WhatsApp persistente en todas las páginas

**Conversión:** No hay pasarela de pagos online. El flujo final es **WhatsApp** (carrito → mensaje estructurado) o **Email** (formulario contacto).

---

## 2. Stack Tecnológico Real

| Capa | Tecnología | Versión | Notas |
|------|------------|---------|-------|
| **Core** | React | 19.2.0 | Concurrent features, nuevo JSX transform |
| **Build** | Vite | 7.3.1 | HMR rápido, code-splitting automático |
| **Routing** | React Router DOM | 7.13.0 | `createBrowserRouter`, lazy loading, `Suspense` |
| **Animaciones** | Framer Motion | 12.38.0 | `layoutId` para shared layout animations (nav pill) |
| **Iconos** | React Icons | 5.5.0 | FontAwesome (Fa), Feather (Fi) |
| **Estilos** | CSS Variables + CSS Modules | Nativo | Design system con `--spacing-*`, `--color-*`, glassmorphism |
| **Persistencia** | localStorage / sessionStorage | Nativo | Carrito + Admin session |
| **Formularios** | Formspree | SaaS | Endpoint `https://formspree.io/f/xwvnwkzq` |
| **Mapas** | Google Maps Embed API | Iframe | Ubicación fija Don Torcuato |
| **Deploy** | Vercel | `vercel.json` | SPA rewrite configurado |

**No usa:** TypeScript, Tailwind CSS, Redux/Zustand, Testing Library, CMS, Base de datos, Backend propio.

---

## 3. Arquitectura de Carpetas (Real)

```
src/
├── App.jsx                     # Entry point + Providers (Cart, Admin)
├── main.jsx                    # React 19 createRoot + RouterProvider
├── router/index.jsx            # Rutas con lazy loading + Suspense + ErrorBoundary
├── environment/environment.js  # Wrapper import.meta.env (VITE_CLAVE_ADMIN)
├── constants/
│   ├── category_names.js       # Enum categorías (8 valores)
│   ├── badge_names.js          # Enum badges (9 valores)
│   ├── brand_names.js          # Enum marcas (15+ valores)
│   └── cartConfig.js           # whatsappNumber: '5491160081534'
├── services/
│   ├── productsData.js         # Barrel export (categories + all + featured)
│   ├── products-all.js         # 65 productos hardcodeados + imports de 65 imágenes
│   ├── products-categories.js  # 7 categorías con label, description, color, icon
│   ├── products-featured.js    # Derivado: filter(isFeatured) de ALL_PRODUCTS
│   ├── brandsData.js           # Marcas con logo/color para sección Brands
│   └── testimonialsData.js     # Testimonios hardcodeados
├── components/
│   ├── ui/
│   │   ├── ProductCard.jsx     # Card reutilizable (Home + Catálogo)
│   │   ├── Button.jsx          # Variantes primary/ghost/outline, tamaños
│   │   ├── PageLoader.jsx      # Skeleton para Suspense
│   │   └── ErrorBoundary.jsx   # Catch errors en lazy routes
│   ├── layout/
│   │   ├── RootLayout.jsx      # Providers + IntroAnimation + Navbar + Outlet + CartDrawer + FloatingWhatsApp + ButtonToTop + Footer
│   │   ├── Navbar.jsx          # Header clásico + NavPill flotante (Framer Motion layoutId) + AdminLoginModal
│   │   ├── Footer.jsx          # 4 columnas: Marca, Nav, Productos, Contacto + Social (IG, TT, WA)
│   │   ├── CartDrawer.jsx      # Slide-over panel derecho con glassmorphism, qty controls, WhatsApp checkout
│   │   ├── FloatingWhatsApp.jsx # Botón fijo bottom-right con pulse animation
│   │   ├── ButtonToTop.jsx     # Scroll to top appear on scroll
│   │   ├── ScrollToTop.jsx     # Auto-scroll al cambiar ruta
│   │   └── AdminLoginModal.jsx # Modal login admin (password vs VITE_CLAVE_ADMIN)
│   └── animations/
│       ├── StarBorder.jsx      # Animated border effect (botón "Consultar" en ProductCard)
│       └── IntroAnimation.jsx  # Animación inicial de entrada
├── context/
│   ├── CartContext.jsx         # Estado global carrito: add/remove/update/clear, localStorage sync, totals
│   └── AdminContext.jsx        # Auth admin: login/logout, sessionStorage persistence
├── hooks/
│   ├── useContactForm.js       # Lógica formulario: validación, submit Formspree, estados (idle/loading/success/error)
│   └── useScrollReveal.js      # IntersectionObserver para animaciones on-scroll
├── pages/
│   ├── Home/
│   │   ├── HomePage.jsx        # Ensambla: Hero, FeaturedProducts, Categories, Brands, Gallery, Testimonials
│   │   └── views/              # 6 secciones con sus CSS
│   ├── Products/
│   │   ├── ProductsPage.jsx    # State activeCategory + CategoryFilter + ProductCatalog
│   │   └── views/
│   │       ├── CategoryFilter/ # Botonera "Todos" + 7 categorías
│   │       └── ProductCatalog/ # Grid con ProductCard (filtra state===true)
│   ├── Contact/
│   │   ├── ContactPage.jsx     # ContactForm + ContactInfo (grid 2 cols)
│   │   └── views/
│   │       ├── ContactForm/    # Formspree POST, validación client-side, honeypot implícito
│   │       └── ContactInfo/    # 4 items + iframe Google Maps Embed
│   ├── About/
│   │   ├── AboutPage.jsx       # AboutHero + ValuesSection
│   │   └── views/              # 2 secciones
│   └── NotFound/NotFoundPage.jsx
├── utils/
│   ├── whatsapp.js             # buildWhatsAppProductUrl(product) → wa.me URL con mensaje prellenado
│   ├── validators.js           # validateContactForm(fields) → {field: error}
│   └── price.js                # parsePrice('$120.000') → 120000, formatPrice(120000) → '$120.000'
└── styles/
    ├── variables.css           # Design tokens: colors, spacing, radius, shadows, transitions, z-index
    ├── reset.css               # Normalize básico
    ├── global.css              # Base typography, container, section, utilities
    └── animations.css          # Keyframes: fadeIn, slideUp, pulse, etc.
```

---

## 4. Modelo de Datos (Producto Real)

```javascript
// src/services/products-all.js → ALL_PRODUCTS[65]
{
  id: Number,                    // 1..65 (no slug, PK numérica)
  name: String,                  // "Taramps 400.4"
  category: String,              // Uno de CATEGORY_NAMES (estereos, parlantes, subwoofers, potencias, accesorios, rackeras, componentes)
  brand: String|null,            // Uno de BRAND_NAMES o null para rackeras genéricas
  image: Module|String|null,     // Import Vite (hashed en build) o null
  description: String,           // Texto plano corto
  badge: String|null,            // Uno de BADGE_NAMES: "Sin Stock", "Recomendado", "Nuevo", "Más Vendido", "Top Calidad", "Oferta", "Económico", "ganga"
  price: String,                 // Precio display: "$160.000"
  base_price: String,            // Precio costo (solo visible si isAdmin): "$120.000"
  state: Boolean,                // true = visible en catálogo, false = oculto
  weight: Number|null,           // kg (solo algunos productos)
  height: Number|null,           // cm
  width: Number|null,            // cm
  depth: Number|null,            // cm
  isFeatured: Boolean            // Solo productos con true aparecen en Home FeaturedProducts
}
```

**Categorías (7):**
| ID | Label | Color | Productos |
|----|-------|-------|-----------|
| `estereos` | Estéreos | #4895ef | 7 |
| `parlantes` | Parlantes | #4cc9f0 | 7 |
| `subwoofers` | Subwoofers/Woofers | #3f37c9 | 3 |
| `potencias` | Potencias | #ced4da | 5 |
| `accesorios` | Accesorios | #adb5bd | 12 |
| `rackeras` | Rackeras | #4cc9f0 | 22 |
| `componentes` | Drivers/Tweeters/Medios | #4cc953 | 11 |

**Marcas (15+):** JBL, Pioneer, Taramps, Sound Digital, Bomber, Jahro, B52, Philco, Infinity Tech, Crown Mustang, Sony, DS18, Blauline, Triton, AudioPipe, Wild Sound, Stetsom, Maverick, Svart, etc.

**Badges (9):** "Sin Stock" (rojo, deshabilita compra), "Más Vendido", "Recomendado", "Nuevo", "Oferta", "Top Calidad", "Económico", "ganga", null.

---

## 5. Funcionalidades Implementadas (Detalle)

### 5.1 Home (`/`)
| Sección | Componente | Contenido |
|---------|------------|-----------|
| Hero | `HeroSection` | Headline, subheadline, CTA "Ver Productos" → `/productos`, CTA "Contactar" → `/contacto`, background image |
| Productos Destacados | `FeaturedProducts` | Grid de productos con `isFeatured===true` (12 items), cada uno con `ProductCard` |
| Categorías | `CategoriesSection` | Grid 7 cards clickeables → `/productos?cat=` (no implementado query param, navega a `/productos` y filtro se hace en ProductsPage) |
| Marcas | `BrandsSection` | Carousel/logos de marcas desde `brandsData.js` |
| Galería | `GallerySection` | 5 fotos del local/instalaciones (lightbox no implementado, solo grid) |
| Testimonios | `TestimonialsSection` | 3 testimonios hardcodeados con avatar, nombre, texto, rating |

### 5.2 Catálogo (`/productos`)
- **Filtro superior:** Botonera "Todos" + 7 categorías (pill style, estado activo visual)
- **Lógica:** `activeCategory === 'all' ? ALL_PRODUCTS : ALL_PRODUCTS.filter(p => p.category === activeCategory)`
- **Render:** `ProductCatalog` → `ProductCard` por cada producto con `state === true`
- **Orden:** Según array `ALL_PRODUCTS` (no hay sort por precio/novedad)

### 5.3 ProductCard (Componente compartido)
| Elemento | Detalle |
|----------|---------|
| Imagen | `img` con `loading="lazy"` o placeholder emoji por categoría |
| Badge | Si existe y ≠ "Sin Stock": badge coloreado (NEW verde, otros azul). "Sin Stock": badge rojo + deshabilita botón carrito |
| Info | Categoría, Nombre, Precio display, Precio base (solo si `isAdmin`), Descripción |
| Specs | Peso (⚖️) y Dimensiones (📏) si están definidos |
| Acciones | 1. **Consultar** → `StarBorder` animado `<a href={whatsappUrl} target="_blank">` 2. **Agregar 🛒** → `addToCart(product)` abre `CartDrawer` |

### 5.4 Carrito de Compras (Completo)
**Estado global:** `CartContext` + `localStorage` key `audiogem_cart_items`

| Función | Implementación |
|---------|----------------|
| Agregar | `addToCart(product, qty=1)` → merge por `id`, incrementa qty, abre drawer |
| Quitar | `removeFromCart(productId)` → filter |
| Actualizar qty | `updateQuantity(id, qty)` → qty≤0 elimina |
| Vaciar | `clearCart()` → `[]` |
| Persistencia | `useEffect` guarda en localStorage cada cambio |
| Totales | `cartItemsCount` (suma quantities), `cartTotal` (suma `parsePrice(price) * qty`) |
| Checkout WhatsApp | `handleSendOrder()` construye mensaje estructurado: `*Pedido AudioGem*`, items con qty/marca/precio/subtotal, `*Total: $X*`, abre `wa.me/5491160081534?text=...` en nueva pestaña |
| Post-checkout | Modal "¿Vaciar carrito?" con botones "Sí, vaciar" / "No, conservar" |
| UI | `CartDrawer` slide-over right (380px desktop, 100% mobile), glassmorphism, overlay click-to-close, ESC-to-close, body scroll lock |

### 5.5 Contacto (`/contacto`)
**Formulario (`ContactForm` + `useContactForm`):**
- Campos: Nombre (requerido), Email (requerido, formato), Teléfono (opcional), Mensaje (requerido)
- Validación client-side (`validators.js`) + validación server-side Formspree
- Estados: `idle` → `loading` → `success` (muestra mensaje + botón "Enviar otro") / `error` (banner rojo)
- Envío: `POST https://formspree.io/f/xwvnwkzq` JSON, `Accept: application/json`
- Honeypot: Formspree lo maneja server-side

**Info lateral (`ContactInfo`):**
- 4 items: 📍 Ubicación, 📞 Tel/WhatsApp (2 números), ✉️ Email, 🕐 Horario "24hs"
- **Mapa:** Google Maps Embed iframe (Don Torcuato, Federico Lacroze 27)

### 5.6 Nosotros (`/nosotros`)
- `AboutHero`: Título, texto historia, imagen
- `ValuesSection`: 4 cards de valores (Calidad, Atención, Experiencia, Garantía)

### 5.7 Autenticación Admin
- **Contexto:** `AdminContext` + `sessionStorage` key `audiogem_admin_auth`
- **Login:** Modal en Navbar (botón "Soy Admin" / "Cerrar sesion Admin")
- **Validación:** `password === import.meta.env.VITE_CLAVE_ADMIN`
- **Uso:** `isAdmin` en `ProductCard` muestra `base_price` (costo) y en Navbar cambia icono/label
- **No hay:** Rutas protegidas, panel CRUD, gestión de productos

### 5.8 Navbar + Navegación
- **Header superior:** Logo (link `/`), Botón Admin, Botón Carrito (badge count), CTA "Consultanos" → `/contacto`
- **NavPill flotante:** 4 items (Inicio, Productos, Nosotros, Contacto) con `NavLink` + `framer-motion layoutId="active-bubble"` para burbuja deslizante animada
- **Responsive:** NavPill bottom en mobile (<768px), top en desktop; header se oculta en mobile
- **Scroll effect:** `navbar--scrolled` añade sombra/background tras 20px scroll

### 5.9 Floating WhatsApp
- Fixed bottom-right, pulse animation, tooltip on hover
- Link: `wa.me/5491160081534?text=Hola%20AudioGem!%20Quiero%20realizar%20una%20consulta.`

### 5.10 Footer
- 4 columnas: Marca + tagline + Social (IG, TikTok, WA), Navegación (4 links), Productos (7 categorías link a `/productos`), Contacto (dirección, 2 teléfonos, email, horario)
- Copyright dinámico `new Date().getFullYear()`

---

## 6. Flujo de Usuario Real (Happy Path)

```mermaid
graph TD
    A[Home /] --> B[Hero CTA Productos]
    A --> C[Hero CTA Contacto]
    A --> D[Featured Products → ProductCard]
    B --> E[/productos]
    C --> F[/contacto]
    D --> G[ProductCard: Consultar WA]
    D --> H[ProductCard: Agregar al carrito]
    H --> I[CartDrawer abre]
    I --> J[Gestionar cantidades]
    J --> K[Enviar pedido por WhatsApp]
    K --> L[wa.me con mensaje estructurado]
    L --> M[Prompt: ¿Vaciar carrito?]
    F --> N[Formulario → Formspree → Email]
    F --> O[Info: WhatsApp / Tel / Email / Mapa]
    A --> P[/nosotros]
    E --> Q[CategoryFilter → ProductCatalog]
    Q --> D
```

---

## 7. Métricas y Analytics (Actual)

**No hay analytics implementado** (no GA4, no Meta Pixel, no eventos custom).
**Recomendación:** Agregar GA4 + events: `view_item`, `add_to_cart`, `begin_checkout` (WhatsApp), `contact_form_submit`, `view_location`.

---

## 8. SEO y Performance (Estado Actual)

| Aspecto | Estado |
|---------|--------|
| **Meta tags** | Solo `index.html` estático (title, description genéricos). No dinámicos por ruta. |
| **JSON-LD** | No implementado (Product, Organization, LocalBusiness) |
| **Sitemap.xml** | No generado |
| **robots.txt** | No presente |
| **Imágenes** | 65 imports Vite → hashed en `dist/assets/`, sin WebP/AVIF automático, sin `srcset` responsive |
| **Lazy loading** | Rutas (React.lazy), imágenes (`loading="lazy"` en ProductCard) |
| **Code splitting** | Automático por ruta (lazy) + vendor chunk |
| **Core Web Vitals** | No medidos en producción |

---

## 9. Accesibilidad (a11y)

| Check | Estado |
|-------|--------|
| Semántica HTML | Buena (header, main, footer, nav, article, aside, form labels) |
| Focus visible | Parcial (algunos botones carecen de `:focus-visible` custom) |
| Contraste | Variables CSS definidas, no auditado WCAG AA |
| Alt text | `alt={name}` en ProductCard, `aria-hidden` en placeholders |
| ARIA labels | En botones icon-only (carrito, admin, close, qty) |
| Formularios | `htmlFor`/`id` correctos, `autoComplete`, errores asociados |
| Navegación teclado | Funcional, NavPill usa `NavLink` nativo |
| Skip link | No implementado |

---

## 10. Deuda Técnica y Mejoras Priorizadas

### Crítico (Seguridad/Funcionalidad)
- [ ] **Variables de entorno en cliente:** `VITE_CLAVE_ADMIN` expuesta en bundle (aunque solo se compara en cliente, no es seguro). Mover auth a backend o usar hash.
- [ ] **Formspree endpoint hardcodeado** en `useContactForm.js` línea 55. Debería estar en `cartConfig.js` o env.
- [ ] **WhatsApp number hardcodeado** en `cartConfig.js` (duplicado en `Footer`, `ContactInfo`, `FloatingWhatsApp`). Centralizar.

### Alto (UX/Conversión)
- [ ] **Product Detail Page** no existe: al clickear producto no navega a detalle, solo muestra card. Falta `/producto/:id` con galería, specs completas, relacionados.
- [ ] **Búsqueda** no implementada (solo filtro por categoría).
- [ ] **Ordenamiento** no implementado (precio, novedad, nombre).
- [ ] **Pagination/Infinite scroll** no implementado (65 productos en un grid).
- [ ] **Meta tags dinámicos** por ruta (`react-helmet-async` o `useEffect` en `document.head`).
- [ ] **JSON-LD structured data** para Product (en futuro PDP), Organization, LocalBusiness.

### Medio (Calidad/DevEx)
- [ ] **TypeScript migration** (actual JS + JSDoc). Tipar `Product`, `CartItem`, `Category`, `Badge`.
- [ ] **Testing:** 0 tests. Agregar Vitest + React Testing Library (smoke tests: render routes, cart add/remove, form submit).
- [ ] **ErrorBoundary** existe pero no loggea a servicio (Sentry/LogRocket).
- [ ] **Image optimization:** Vite no convierte a WebP/AVIF automático. Usar `@vitejs/plugin-imagetools` o sharp en build.
- [ ] **Bundle analysis:** `vite-bundle-analyzer` para auditar chunks.

### Bajo (Nice to have)
- [ ] **PWA:** `vite-plugin-pwa` para service worker + manifest + install prompt.
- [ ] **Dark mode:** Variables CSS preparadas, falta toggle + `localStorage` theme.
- [ ] **Internacionalización:** Solo español (AR). Preparar `i18n` si se expande.
- [ ] **Comparador productos** y **Wishlist** (localStorage).
- [ ] **Blog/Guías** para SEO orgánico (Astro o MDX en subpath).

---

## 11. Variables de Entorno Requeridas

```bash
# .env (no commiteado)
VITE_CLAVE_ADMIN=tu_password_segura_aqui
# Opcional para futuro:
# VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/xwvnwkzq
# VITE_WHATSAPP_NUMBER=5491160081534
# VITE_GA4_ID=G-XXXXXXXXXX
```

---

## 12. Scripts Disponibles

```json
{
  "dev": "vite",                    // Dev server HMR
  "build": "vite build",            // Producción → dist/
  "lint": "eslint .",               // ESLint flat config
  "preview": "vite preview"         // Preview build local
}
```

---

## 13. Deploy (Vercel)

`vercel.json` configura SPA rewrite:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
Build output: `dist/` (Vite default). Vercel detecta Vite automáticamente.

---

## 14. Próximos Pasos Recomendados (Roadmap Realista)

| Sprint | Objetivo | Esfuerzo |
|--------|----------|----------|
| **1** | Product Detail Page (`/producto/:id`) + breadcrumbs + JSON-LD Product | 3-5 días |
| **2** | Búsqueda + Ordenamiento + Paginación en `/productos` | 2-3 días |
| **3** | Meta tags dinámicos + Sitemap + robots.txt + GA4 events | 2 días |
| **4** | Migración a TypeScript (tipado progresivo) | 3-5 días |
| **5** | Tests unitarios/integración (Vitest + RTL) + CI GitHub Actions | 3 días |
| **6** | Panel Admin real: CRUD productos (Keystatic/TinaCMS o custom + API) | 1-2 semanas |
| **7** | PWA + Image optimization (WebP/AVIF) + Dark mode | 2-3 días |

---

## 15. Criterios de Aceptación (Para Validar Estado Actual)

- [x] Home carga sin errores, Hero + 6 secciones renderizan
- [x] `/productos` filtra por 7 categorías, muestra solo `state===true`
- [x] ProductCard: imagen, badge, precio, specs, botón Consultar (WA), botón Agregar (carrito)
- [x] Carrito: add/remove/update/qty, persiste localStorage, total correcto
- [x] Checkout WhatsApp: mensaje estructurado con items, subtotales, total, abre `wa.me`
- [x] Post-checkout: prompt vaciar/conservar funciona
- [x] `/contacto` formulario valida, envía a Formspree, muestra success/error
- [x] `/contacto` info + mapa embebido cargan
- [x] `/nosotros` renderiza hero + valores
- [x] Navbar: logo, admin login/logout, carrito badge, CTA, NavPill animada
- [x] Floating WhatsApp visible en todas las rutas
- [x] Footer: links, social, contacto, copyright dinámico
- [x] Admin: login con `VITE_CLAVE_ADMIN` muestra `base_price` en cards
- [x] Build `npm run build` genera `dist/` sin errores
- [x] Deploy Vercel funcional con SPA rewrite

---

## 16. Notas para Futuro Desarrollo

> **Este PRD documenta lo EXISTENTE.** Para nuevas features, crear SDD change proposal (`/sdd-new <feature>`) siguiendo el flujo: explore → propose → spec → design → tasks → apply → verify → archive.

**Decisiones arquitectónicas clave a respetar:**
1. **Datos en `src/services/*.js`** — Single source of truth. Para backend real, reemplazar imports por `fetch()` en barrel `productsData.js` sin tocar componentes.
2. **CSS Variables design system** — No introducir Tailwind/otro framework sin migración planificada.
3. **CartContext + localStorage** — Es el "backend" del carrito. No romper la interfaz `useCart()`.
4. **AdminContext + sessionStorage** — Auth simple, no JWT. Para panel real, evaluar Next.js API routes o Supabase Auth.
5. **WhatsApp como checkout** — No hay pasarela de pagos. Cualquier "pago online" requiere cambio arquitectónico mayor.

---

**Última actualización:** 2026-08-20 — Generado por ingeniería inversa del código fuente actual.