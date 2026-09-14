# Sitio web de CALL FIRE

Sitio estático de una sola página para **CALL FIRE — Seguridad e Higiene**
(Villa Constitución, Santa Fe).

Sin framework, sin dependencias y sin proceso de build: son HTML, CSS y un
archivo JS. Se puede abrir `index.html` directamente en el navegador.

## Estructura

```
index.html              Toda la página
assets/css/styles.css   Estilos (la paleta está al principio, en :root)
assets/js/main.js       Menú móvil, animaciones, scroll y formulario
assets/img/             Logos en SVG, foto del hero e imagen para compartir
assets/icons/           Favicons
```

## Detalles de implementación

**Animaciones.** Los textos y las fichas entran con un fundido y un
desplazamiento leve: el hero al cargar, el resto a medida que se scrollea.
Están en `styles.css`, dentro del bloque *animaciones de entrada*, y en
`main.js`, en la constante `ANIMADOS`. **La lista de selectores está en los dos
lados: si se agrega un elemento, hay que agregarlo en ambos.**

Todo el bloque vive dentro de `@media (prefers-reduced-motion: no-preference)`
y depende de la clase `js` que un script en el `<head>` agrega al `<html>`. Así,
si el visitante tiene las animaciones desactivadas en su sistema o si el JS no
carga, la página se ve completa y quieta, nunca en blanco.

**Cabecera.** Es fija y arranca transparente sobre la foto del hero; al bajar
24 px se vuelve blanca con sombra (clase `pegada`). El alto está en la variable
`--alto-cabecera`, que el hero usa para calcular su padding superior.

**Fotos de fondo.** El hero usa `assets/img/fondo-landing.jpg` con un velo
blanco encima (`.hero::before`) para que el texto negro se lea; la sección
Crossover usa `assets/img/fondo-crossover.jpg` con un velo oscuro
(`.crossover::before`) por el motivo inverso. **Si se cambia alguna foto hay que
recalibrar su velo**: el del hero está hecho para una imagen clara del lado
izquierdo, el del Crossover para una imagen ya oscura.

## Publicar

**GitHub Pages** — subir el repo, entrar en *Settings › Pages*, elegir la rama
`main` y la carpeta `/ (root)`. Queda publicado en pocos minutos.

**Netlify o Vercel** — conectar el repositorio. No hay comando de build; la
carpeta a publicar es la raíz.

Cuando haya dominio propio, se apunta desde el panel del proveedor y se agrega
un archivo `CNAME` con el dominio si se usa GitHub Pages.

## SEO

Lo que está hecho en el código:

- `title` y `description` con el servicio y la localidad, dentro del largo que
  Google muestra sin cortar.
- **Datos estructurados** (`application/ld+json`, tipo `ProfessionalService`)
  con teléfono, correo, localidad, zona de trabajo y el catálogo de servicios y
  cursos. Es lo que le permite a Google entender que esto es una empresa local
  y armar su ficha. Se puede revisar en
  [search.google.com/test/rich-results](https://search.google.com/test/rich-results).
- `sitemap.xml` y `robots.txt` apuntándose entre sí.
- Open Graph con imagen de 1200×630 y URL absoluta, para la vista previa al
  compartir por WhatsApp o redes.
- HTML semántico, un solo `h1`, `alt` en todas las imágenes, `lang="es-AR"`.

**Lo que el código no puede hacer**, y pesa más que todo lo anterior para que
los encuentren en la zona:

1. **Perfil de Empresa en Google** (el que aparece en Maps y en el panel de la
   derecha). Es gratis, se hace en `google.com/business` y para una empresa
   local es lo que más mueve la aguja.
2. **Google Search Console**: dar de alta el sitio y enviar el `sitemap.xml`.
3. **Dominio propio.** Un subdirectorio de `github.io` posiciona bastante peor
   que un dominio.
4. **Tiempo y contenido.** Un sitio nuevo no aparece de un día para el otro.

## Cuando haya dominio propio

Hay cuatro lugares con la dirección escrita completa que hay que actualizar:

- `index.html`: `canonical`, `og:url` y `og:image`
- `index.html`: las claves `url`, `logo` e `image` del bloque JSON-LD
- `sitemap.xml`: la etiqueta `loc`
- `robots.txt`: la línea `Sitemap:`

Y agregar un archivo `CNAME` con el dominio, si se sigue usando GitHub Pages.

## Pendientes antes de publicar

- [ ] **Redes sociales.** En `index.html`, dentro de `<ul class="redes">`, los
      enlaces están en `href="#"`. Reemplazar por las URL reales de Instagram,
      Facebook, YouTube y TikTok. Si alguna red no se va a usar, borrar su
      elemento `<li>` completo.
- [ ] **Dominio.** Completar `<link rel="canonical">` y `og:image` con la URL
      absoluta del sitio (ej. `https://callfire.com.ar/assets/img/og-image.png`).
      Las rutas relativas funcionan igual, pero algunas redes muestran mejor la
      vista previa con la URL completa.
- [ ] **Fotos.** Hoy el sitio no usa fotografías. Sumar imágenes reales de
      capacitaciones mejora bastante la credibilidad; los lugares naturales son
      el hero y las fichas de cursos.

## Datos cargados

| Dato | Valor |
|---|---|
| WhatsApp | +54 9 3364 56-4114 |
| Correo | callfire.seh@gmail.com |
| Zona | Villa Constitución, Santa Fe y alrededores |
| Responsable técnico | Lic. Nicolás Bastianelli |

Para cambiar el número de WhatsApp hay que tocarlo en tres lugares: los dos
enlaces `wa.me` de `index.html` y la constante `TELEFONO` en `assets/js/main.js`.

## Marca

La paleta y el uso del logo siguen el *Manual de identidad de CALL FIRE*.
Colores: negro `#20252B`, rojo `#D6281C`, blanco `#FFFFFF`.
Tipografías: Montserrat (títulos) e Inter (textos), ambas desde Google Fonts.
