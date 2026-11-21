/* plan.js — muestra qué plan eligió la persona y lo guarda para webmcp_form.js.
   Sin código en línea (CSP). */
(function () {
  "use strict";
  var sel = document.getElementById("plan-sel");
  if (!sel) return;
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("[data-plan]");
    if (!a) return;
    var plan = a.getAttribute("data-plan");
    sel.textContent = "Consulta sobre: " + plan;
    sel.dataset.plan = plan;
    sel.hidden = false;
  });
})();
