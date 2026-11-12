---
type: reference
status: active
tags: [store, listing, amo, es]
project: qrgen
---

# SVG QR Code Generator — ficha de AMO, español

Solo para los complementos de Firefox: un texto propio en el Markdown de AMO, distinto del de la Chrome Web Store. Reglas: [README](../README.md).

## Description

**Un código QR de la página que estás leyendo, en la barra lateral de Firefox.** Pulsa el botón de la barra de herramientas y SVG QR Code Generator muestra el código de la pestaña actual. Escanéalo con la cámara del móvil y continúa allí: sin mandarte enlaces por correo, sin sincronizar nada y sin registrarte. Este generador de códigos QR en SVG dibuja cada código localmente, como un vector limpio.

**Del ordenador al móvil**

- La barra lateral arranca con la página actual, así que pasarla al móvil es cuestión de un solo escaneo.
- También sirve para un servidor de desarrollo en tu red local: ábrelo con la IP del ordenador y escanea.
- Solo se abren las direcciones a las que llega el móvil; localhost y otros nombres que solo conoce tu ordenador, no.

**Crear códigos**

- Escribe cualquier texto o enlace en lugar de la dirección de la página.
- Cuatro tamaños predefinidos y cuatro niveles de corrección de errores; con Q o H un código impreso resiste mejor los arañazos.
- Guarda el código como archivo SVG o copia el marcado: un único trazado, unos pocos kilobytes, nítido a cualquier escala.

**Compartir e insertar**

- Un enlace para compartir en qr.clx.cx reconstruye la imagen a partir del propio enlace cada vez que se abre, así que nunca se guarda ningún archivo de imagen.
- Los snippets para HTML, Markdown, React y Vue están a un clic.
- Los códigos que copias con «Copiar enlace» pasan al Historial y se quedan solo en este ordenador.

**Privacidad**

- El complemento no hace ninguna solicitud de red por su cuenta.
- Lo que codifiques puede leerlo cualquiera que reciba el enlace para compartir, así que deja fuera los secretos.
- Sin registro, sin analíticas, sin anuncios.

¿Quieres contar escaneos? Mete un enlace corto de [clx.cx](https://clx.cx/short-links) dentro del código.

De 301.st, código abierto en [GitHub](https://github.com/investblog/qrgen). Temas claro y oscuro; la interfaz sigue el idioma de tu Firefox, en siete idiomas.
