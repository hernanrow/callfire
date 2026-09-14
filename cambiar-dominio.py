# -*- coding: utf-8 -*-
"""Cambia la dirección del sitio en todos los archivos que la tienen escrita.

La dirección completa aparece en varios lugares porque Google y las redes la
necesitan absoluta, no relativa. Este script los actualiza todos de una vez, así
no hay que buscarlos a mano y arriesgarse a olvidar uno.

Uso:

    python cambiar-dominio.py https://callfire.com.ar/

Para ver qué cambiaría sin tocar nada:

    python cambiar-dominio.py https://callfire.com.ar/ --simular

Después del cambio hay que hacer commit y push como siempre.
"""
import io
import os
import re
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))

# Archivo -> en qué parte aparece la dirección, para poder informarlo
ARCHIVOS = {
    "index.html": "canonical, og:url, og:image y el bloque de datos estructurados",
    "sitemap.xml": "la etiqueta <loc>",
    "robots.txt": "la línea Sitemap:",
}


def base_actual():
    """Lee la dirección que está en uso desde la etiqueta canonical."""
    ruta = os.path.join(AQUI, "index.html")
    html = io.open(ruta, encoding="utf-8").read()
    m = re.search(r'<link rel="canonical" href="([^"]+)"', html)
    if not m:
        sys.exit("No encontré la etiqueta canonical en index.html.")
    return m.group(1)


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    simular = "--simular" in sys.argv

    if len(args) != 1:
        sys.exit(__doc__)

    nueva = args[0]
    if not nueva.startswith(("http://", "https://")):
        sys.exit("La dirección tiene que empezar con https://")
    if not nueva.endswith("/"):
        nueva += "/"

    vieja = base_actual()
    if vieja == nueva:
        print("La dirección ya es %s. No hay nada que cambiar." % nueva)
        return

    print("De:  %s" % vieja)
    print("A:   %s" % nueva)
    print()

    total = 0
    for nombre, donde in ARCHIVOS.items():
        ruta = os.path.join(AQUI, nombre)
        if not os.path.exists(ruta):
            print("  (falta %s, lo salteo)" % nombre)
            continue

        texto = io.open(ruta, encoding="utf-8").read()
        cuantas = texto.count(vieja)
        if not cuantas:
            print("  %-14s sin cambios" % nombre)
            continue

        if not simular:
            io.open(ruta, "w", encoding="utf-8").write(texto.replace(vieja, nueva))
        total += cuantas
        print("  %-14s %d reemplazo(s) — %s" % (nombre, cuantas, donde))

    print()
    if simular:
        print("Simulación: no se modificó ningún archivo.")
    else:
        print("Listo: %d reemplazos." % total)
        print()
        print("Falta:")
        print("  1. git add -A && git commit -m \"Dominio propio\" && git push")
        print("  2. Agregar el dominio en el panel de Cloudflare Pages.")
        print("  3. En Google Search Console, dar de alta el dominio nuevo")
        print("     y volver a enviar el sitemap.")


if __name__ == "__main__":
    main()
