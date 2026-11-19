/* consent.js — consentimiento de cookies y analítica (LSSI + RGPD).
   Google Analytics NO se carga hasta que la persona pulsa «Aceptar».
   Si pulsa «Rechazar» o ignora el aviso, no se carga y no se envía nada a Google.
   La elección se guarda en el navegador y se puede cambiar desde el enlace
   <a href="#" data-consent-open> del pie de página.
   Requiere en _headers: script-src https://*.googletagmanager.com y
   connect-src https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com
   Sin código ni estilos en línea (la política de seguridad del sitio los bloquea). */
(function () {
  "use strict";

  var GA_ID = "G-CCL5B23RY5";
  var KEY = "jm20-consent-v1";
  var PRIVACY = "politica-de-privacidad.html";
  var TXT = {
    title: "Cookies y analítica",
    body: "Nos gustaría usar Google Analytics para entender cómo se usa nuestro sitio. Solo se activa si aceptas. Puedes cambiar tu elección en cualquier momento desde «Configuración de cookies» en el pie de página.",
    accept: "Aceptar",
    reject: "Rechazar",
    more: "Política de privacidad",
    label: "Preferencias de cookies"
  };

  // Secuencia de consentimiento de Google: por defecto denegado; se concede solo tras aceptar.
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied"
  });

  var gaLoaded = false;
  var banner = null;

  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function write(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function loadGA() {
    if (gaLoaded) return;
    gaLoaded = true;
    var sc = document.createElement("script");
    sc.async = true;
    sc.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(sc);
    gtag("js", new Date());
    gtag("consent", "update", { analytics_storage: "granted" });
    gtag("config", GA_ID);
  }

  // Al rechazar o retirar el consentimiento, borra las cookies _ga que hubiera.
  function clearGACookies() {
    var host = location.hostname;
    var parts = host.split(".");
    var domains = ["", host, "." + host];
    if (parts.length > 2) domains.push("." + parts.slice(-2).join("."));
    document.cookie.split(";").forEach(function (c) {
      var name = c.split("=")[0].trim();
      if (name.indexOf("_ga") === 0) {
        domains.forEach(function (d) {
          document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" + (d ? "; domain=" + d : "");
        });
      }
    });
  }

  function hide() {
    if (banner) { banner.remove(); banner = null; }
  }

  function decide(v) {
    write(v);
    if (v === "yes") {
      loadGA();
    } else {
      gtag("consent", "update", { analytics_storage: "denied" });
      clearGACookies();
    }
    hide();
  }

  function btn(label, val) {
    var b = document.createElement("button");
    b.type = "button";
    b.textContent = label;
    b.addEventListener("click", function () { decide(val); });
    return b;
  }

  function show() {
    if (banner) { banner.querySelector("button:last-child").focus(); return; }
    banner = document.createElement("div");
    banner.id = "jm20-consent";
    banner.className = "cc";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-modal", "false");
    banner.setAttribute("aria-label", TXT.label);

    var title = document.createElement("strong");
    title.textContent = TXT.title;

    var p = document.createElement("p");
    p.appendChild(document.createTextNode(TXT.body + " "));
    var a = document.createElement("a");
    a.href = PRIVACY;
    a.textContent = TXT.more;
    p.appendChild(a);

    // Aceptar y Rechazar con el mismo peso visual (exigencia de la AEPD): mismos estilos, mismo tamaño.
    var row = document.createElement("div");
    row.className = "cc-b";
    row.appendChild(btn(TXT.reject, "no"));
    row.appendChild(btn(TXT.accept, "yes"));

    banner.appendChild(title);
    banner.appendChild(p);
    banner.appendChild(row);
    banner.addEventListener("keydown", function (e) { if (e.key === "Escape") decide("no"); });
    document.body.appendChild(banner);
  }

  window.jm20OpenConsent = show;

  // Enlace "Configuración de cookies" del pie: <a href="#" data-consent-open>
  document.addEventListener("click", function (e) {
    var t = e.target.closest && e.target.closest("[data-consent-open]");
    if (t) { e.preventDefault(); show(); }
  });

  function init() {
    var c = read();
    if (c === "yes") loadGA();
    else if (c !== "no") show();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
