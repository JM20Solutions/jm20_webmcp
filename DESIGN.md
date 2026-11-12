# DESIGN.md: JM20 · WebMCP

Hereda el sistema de la web principal (`main_website/css/site.css`) y de Noah/Murph: sistema Apple, un único azul de acción. Si algo se contradice con la web principal, manda la web principal.

## Tokens (idénticos a la web principal)
- Tipografía: pila `-apple-system, BlinkMacSystemFont, "SF Pro Display", Inter, system-ui`. Inter 400 y 600 alojada en `/fonts` (los mismos archivos que la web principal). Sin Google Fonts, sin segunda familia.
- Color: tinta `#1d1d1f`, gris `#6e6e73`, parchment `#f5f5f7`, azul de acción `#0066cc`, azul sobre oscuro `#2997ff`, mosaico oscuro `#1d1d1f`. Sin segundo color de acento.
- Titulares 600 con tracking negativo: h1 `clamp(36px,5.6vw,68px)` / -.03em; h2 `clamp(30px,4.6vw,52px)` / -.025em; h3 `clamp(24px,3vw,34px)`. Cuerpo 17px / 1,5.
- Botones: píldora, 600 16px, relleno 12×24; sobre oscuro, azul `#2997ff` con texto `#1d1d1f` (contraste AA). Pulsado: `scale(.97)`.
- Contenedores: tarjetas 22px, campos 10px, selectores 18px. Sin sombras salvo la del vídeo del hero.

## Estructura
Nav translúcida blanca de 52px con logo `jm20-logo.png`, enlaces grises y botón "Contacto"; hamburguesa ≤760px. Hero centrado, el resto alineado a la izquierda. Ritmo de mosaicos: hero oscuro, `#demo` blanco, `#beneficios` oscuro, `#agentes` blanco, `#metodo` parchment, `#quienes` blanco, `#audit` oscuro, `#ecosistema` blanco, pie parchment. Los productos van después del formulario para que no desvíen de la acción principal.

## Reglas de esta página
- Una sola etiqueta para la acción principal: "Solicitar auditoría".
- Titular: afirmación suave ("Puede que tu negocio sea invisible…"), coherente con el aviso de que no se garantizan resultados; `<title>` y `og:title` repiten el mismo mensaje, sin años.
- Selección (tamaño de empresa): relleno `#1d1d1f` con texto blanco sobre claro; relleno `#f5f5f7` con texto tinta sobre oscuro. El selector de precios y el del formulario están sincronizados; "Solicitar auditoría" en la tarjeta marca el tamaño en el formulario.
- Sin JavaScript, los tres planes se ven apilados. Los cuatro pasos se explican una sola vez (tres son de pago único y el cuarto es mantenimiento mensual).
- Sin jerga en el copy: nada de "agéntica"; la tercera fase se llama "Acciones para la IA". WebMCP se describe como propuesta de estándar con soporte inicial en Chrome (revisar si cambia su estado).
- Bajo el formulario, el bloque "Qué pasa después" resume el proceso y los plazos por tamaño de empresa.
- Todo error de formulario va en texto junto al campo; el envío correcto muestra "Solicitud enviada".
- Formulario: envía a Supabase, tabla `public.leads_webmcp`, con la clave anon en `apikey` y `Authorization: Bearer`. Campos enviados: `nombre, empresa, url, email, tamano, consentimiento`. Antes de enviar, la URL se normaliza (añade `https://` si falta). La tabla debe permitir solo inserciones con la clave anon.
- WebMCP: `#audit-form` es una herramienta declarativa (`toolname`, `tooldescription`, `toolparamdescription`), sin `toolautosubmit`: la persona revisa, acepta la privacidad y envía.
- Vídeos: `mcpvideo.mp4` (hero) y `video-2.mp4`, ambos en la raíz, con póster (`poster-1.jpg`, `poster-2.jpg`, fotograma a los 3 s). Si un vídeo no carga, queda la simulación. Si algún vídeo lleva voz, hay que añadir subtítulos (`data-captions` con un .vtt).
- El copy es del cliente. Decidido: frase en minúscula (sentence case) en titulares y etiquetas, como la web principal.

- Confianza: `#quienes` (solo datos que la empresa ya publica en su web; sin nombres ni cifras inventados) va justo antes del formulario. `audit-ejemplo.html` es un ejemplo con un negocio ficticio, marcado como ejemplo y con `noindex` para que los datos inventados no se confundan con un negocio real; hay que mantenerlo alineado con lo que de verdad entrega una auditoría.
- Contacto humano: `contact@jm20aisolutions.com` bajo el formulario (correo de contacto de la empresa).
- Estilos nuevos en `extras.css` (quiénes somos, contacto, ejemplo de auditoría).
