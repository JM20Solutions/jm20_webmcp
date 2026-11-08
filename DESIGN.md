# DESIGN.md: JM20, landing de auditoría de visibilidad en IA

Modo: Persuade. Idioma: español, frases en minúscula salvo nombres propios (sin Title Case).

## Color
- Primario `#0066cc` (hover/foco `#0071e3`), sobre fondo oscuro `#2997ff`. Coincide con el "20" del logo (`#2997ff`, medido en og-image.png). El "JM" del logo es terracota `#c76b45`, aún sin uso en la página. Fondo del logo: negro (`#000000` a `#090706`).
- Texto `#1d1d1f` / `#333`; secundario `#6e6e73`; sobre oscuro `#ccc`.
- Superficies: lienzo `#fff`, pergamino `#f5f5f7`, mosaico oscuro `#272729`, vista del agente `#000`.
- Error `#ff6b6b` (solo sobre oscuro, siempre acompañado de texto).

## Color de marca
- Azul `#2997ff` (ya en uso) y terracota `#c76b45`. La terracota no se usa en elementos interactivos (el sistema admite un solo color de acción). Contraste medido: sobre `#272729` ≈ 4:1 y sobre blanco ≈ 3,7:1, así que solo para texto grande o formas sobre fondos oscuros.

## Tipografía
- Sistema apple-design-analysis: SF Pro Display/Text con Inter de respaldo, titulares en 600, tracking negativo (-0.374px en cuerpo, -0.28px en h1).
- Cuerpo 17px/1.5; texto secundario 14px mínimo; sobre oscuro, interlineado 1.6 y peso 400.

## Forma y espacio
- Botones píldora (9999px); contenedores 18px; inputs 44px de alto; objetivos táctiles ≥44px.
- Mosaicos alternos claro, oscuro, claro, pergamino, claro, oscuro. Relleno vertical 96px (64px en móvil).

## Motivo propio
- Simulación de chat de IA (burbuja de la persona y burbuja de la IA) en `#demo` y `#agentes`. Sustituye a los vídeos hasta que existan y se reemplaza por ellos con `data-src`. Es el único momento de énfasis; el resto se mantiene sobrio.

## Reglas
- En la tabla de precios, la columna elegida se pinta en `#1d1d1f` con texto blanco (escritorio).
- Los vídeos van en `videos/video-1.mp4` y `videos/video-2.mp4`; si el archivo no carga, se queda la simulación.
- El copy es del cliente: no se reescribe sin permiso expreso.
- Todas las secciones van centradas, como en el sistema de referencia.
- Estado seleccionado de los selectores: fondo `#1d1d1f` con texto blanco (button-dark-utility).
- El tamaño de empresa se elige una sola vez: el selector de `#metodo` y las opciones del formulario están sincronizados.
- Los vídeos entran con `data-src` (demo, agentes y tarjetas de Noah y Murph). Sin `data-src`, las tarjetas no muestran hueco; la simulación de chat solo existe hasta que haya vídeo.
- Una explicación por idea: las fases se definen una sola vez (tabla de precios), no por plan.
- Sin kickers, sin flechas en enlaces, sin mayúsculas sostenidas, sin tarjetas anidadas.
- Todo error de formulario lleva mensaje en texto junto al campo.
- Ejemplos ilustrativos se rotulan como tales.
