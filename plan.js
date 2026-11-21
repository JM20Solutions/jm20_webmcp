/* plan.js — muestra qué plan eligió la persona al pulsar un botón de precios.
   Solo informa en pantalla: no cambia el envío del formulario. Sin código en línea (CSP). */
(function () {
  "use strict";
  var sel = document.getElementById("plan-sel");
  if (!sel) return;
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("[data-plan]");
    if (!a) return;
    sel.textContent = "Consulta sobre: " + a.getAttribute("data-plan");
    sel.hidden = false;
  });
})();
