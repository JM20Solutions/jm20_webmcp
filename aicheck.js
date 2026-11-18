/* aicheck.js — comprobación gratuita para agentes de IA (comprobar.html).
   Lógica del prototipo agent-ready-test.html. Se quitaron: la caja "Página de prueba" y la tabla "Detalle de prueba".
   Los webhooks de n8n solo funcionan si el workflow está ACTIVADO en n8n. */
(function () {
  "use strict";

  var SCAN_URL = "https://gpixie.app.n8n.cloud/webhook/free-scan";
  var UNLOCK_URL = "https://gpixie.app.n8n.cloud/webhook/free-unlock";
  var AUDIT_REQUEST_URL = "https://gpixie.app.n8n.cloud/webhook/audit-request";
  var PRIVACY_URL = "https://aiready.jm20aisolutions.com/politica-de-privacidad";

  // Texto de consentimiento en BORRADOR (igual que en el prototipo). Debe revisarlo alguien que conozca la ley antes de publicar.
  var CONSENT_REQUIRED_PREFIX = "Acepto que JM20 AI Solutions use mi email para contactarme sobre este análisis y, si solicito la auditoría, para enviármela. He leído la ";
  var CONSENT_REQUIRED_LINK = "política de privacidad";
  var CONSENT_REQUIRED_SUFFIX = ".";
  var CONSENT_REQUIRED_TEXT = CONSENT_REQUIRED_PREFIX + CONSENT_REQUIRED_LINK + CONSENT_REQUIRED_SUFFIX;
  var CONSENT_MARKETING_TEXT = "Quiero recibir información y novedades de JM20 AI Solutions por email. Puedo darme de baja cuando quiera. (Opcional)";

  var CHECKS = [
    "Archivo robots.txt",
    "Mapa del sitio (sitemap.xml)",
    "Cabeceras Link",
    "Contenido en Markdown para agentes",
    "Reglas para rastreadores de IA",
    "Señales de uso de contenido",
    "Índice de Agent Skills"
  ];

  var currentScanId = "";
  var currentEmail = "";
  var currentUrl = "";

  var chat = document.getElementById("chat");
  var form = document.getElementById("form");
  var input = document.getElementById("urlInput");
  var go = document.getElementById("go");
  if (!chat || !form || !input || !go) return;

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  function addMsg(cls) {
    var m = el("div", "ac-msg" + (cls ? " " + cls : ""));
    chat.appendChild(m);
    return m;
  }
  function scrollDown() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }

  // Envía campos de formulario a un webhook de n8n y devuelve la respuesta JSON ya interpretada.
  function postForm(url, fields) {
    var body = new URLSearchParams();
    Object.keys(fields).forEach(function (k) { body.set(k, fields[k]); });
    return fetch(url, { method: "POST", body: body }).then(function (res) {
      return res.text().then(function (txt) {
        var data = null;
        try { data = JSON.parse(txt); } catch (e) {}
        if (!data) {
          throw new Error("Respuesta vacía o no válida (código " + res.status + "). Texto recibido: " + txt.slice(0, 200));
        }
        if (data.ok !== true && data.ok !== false) {
          throw new Error("n8n respondió algo inesperado (código " + res.status + "): " + (data.message || txt.slice(0, 200)) + (data.hint ? " | " + data.hint : ""));
        }
        return data;
      });
    });
  }

  function finish() {
    go.disabled = false;
    input.disabled = false;
    input.value = "";
    input.focus();
    scrollDown();
  }

  function showTechnicalError(box, e) {
    box.textContent = "";
    box.appendChild(el("p", "ac-bad", "No se pudo conectar con el análisis."));
    box.appendChild(el("p", "ac-note", "Detalle técnico: " + e.message));
    box.appendChild(el("p", "ac-note", "Comprueba que el workflow de n8n está activado."));
  }

  function renderResult(box, data) {
    if (!data || data.ok === false) {
      box.appendChild(el("p", "ac-bad", (data && data.error) || "No se pudo completar el análisis."));
      return;
    }

    var n = data.problems;
    var total = data.totalChecks;
    var unable = data.unableToCheck;

    if (n === 0 && unable === 0) {
      box.appendChild(el("p", "ac-good", "¡Enhorabuena! Tu web supera los " + total + " puntos clave."));
      box.appendChild(el("p", "ac-note", "Esto no garantiza que las IA te recomienden. Nuestra auditoría revisa lo que este análisis rápido no cubre."));
    } else if (n === 0) {
      box.appendChild(el("p", "", "No hemos podido comprobar " + unable + " de los " + total + " puntos clave. Puede que tu web bloquee los análisis automáticos."));
    } else {
      box.appendChild(el("p", "ac-bad", "Tu web no supera " + n + " de los " + total + " puntos clave."));
      if (unable > 0) {
        box.appendChild(el("p", "ac-note", "Además, no hemos podido comprobar " + unable + (unable === 1 ? " punto." : " puntos.")));
      }
      box.appendChild(el("p", "", "Si quieres saber cuáles son y cómo solucionarlos, solicita la auditoría completa."));

      var btn = el("button", "btn", "Solicitar auditoría completa");
      btn.type = "button";
      btn.addEventListener("click", function () {
        btn.disabled = true;
        openRequestForm();
      });
      box.appendChild(btn);
    }
  }

  // Paso 3: formulario de solicitud de auditoría (rellenado con lo que la persona ya indicó).
  function openRequestForm() {
    var box = addMsg("ac-gate");
    box.appendChild(el("p", "", "Para solicitar tu auditoría completa, confirma tus datos:"));
    box.appendChild(el("p", "ac-note", "Auditoría: 99 € + IVA · 1 sitio web (hasta 5 páginas) · entrega dentro de  24 horas. Si contratas la optimización, el importe de la auditoría se descuenta."));

    function addField(id, labelText, type, value, autocomplete) {
      var lab = el("label", "ac-label", labelText);
      lab.setAttribute("for", id);
      var inp = el("input", "ac-input");
      inp.id = id;
      inp.type = type;
      inp.value = value || "";
      if (autocomplete) inp.autocomplete = autocomplete;
      box.appendChild(lab);
      box.appendChild(inp);
      return inp;
    }

    var nameIn = addField("rq-name", "Tu nombre", "text", "", "name");
    var bizIn = addField("rq-biz", "Nombre de tu negocio", "text", "", "organization");
    var mailIn = addField("rq-mail", "Email (puedes cambiarlo)", "email", currentEmail, "email");
    var webIn = addField("rq-web", "Tu web", "text", currentUrl, "url");

    var err = el("p", "ac-err", "");
    err.setAttribute("role", "alert");
    box.appendChild(err);

    var btn = el("button", "btn", "Enviar solicitud");
    btn.type = "button";
    box.appendChild(btn);

    btn.addEventListener("click", function () {
      if (!nameIn.value.trim() || !bizIn.value.trim() || !mailIn.value.trim() || !webIn.value.trim()) {
        err.textContent = "Rellena todos los campos.";
        return;
      }
      err.textContent = "";
      btn.disabled = true;
      postForm(AUDIT_REQUEST_URL, {
        scanId: currentScanId,
        name: nameIn.value.trim(),
        business: bizIn.value.trim(),
        email: mailIn.value.trim(),
        website: webIn.value.trim()
      })
        .then(function (data) {
          if (data.ok === false) {
            err.textContent = data.error || "No se pudo enviar la solicitud.";
            btn.disabled = false;
            return;
          }
          box.textContent = "";
          box.appendChild(el("p", "ac-good", "¡Gracias! Hemos recibido tu solicitud."));
          box.appendChild(el("p", "", "Te contactamos al email indicado para completar el pago, y recibirás la auditoría en un plazo de 24 horas desde la confirmación."));
          scrollDown();
        })
        .catch(function (e) {
          err.textContent = "No se pudo conectar. " + e.message;
          btn.disabled = false;
        });
    });
    scrollDown();
    nameIn.focus();
  }

  // Paso 2: pedir el email y el consentimiento antes de mostrar el resultado.
  function showGate(scanId) {
    var gate = addMsg("ac-gate");
    currentScanId = scanId;
    gate.appendChild(el("p", "", "Ya tengo el resultado. Por favor, ingresa tu email para poder verlo."));

    var emailInput = el("input", "ac-input");
    emailInput.type = "email";
    emailInput.placeholder = "tu@email.com";
    emailInput.autocomplete = "email";
    emailInput.setAttribute("aria-label", "Tu email");
    gate.appendChild(emailInput);

    var reqLabel = el("label", "ac-consent");
    var reqBox = el("input", "");
    reqBox.type = "checkbox";
    reqLabel.appendChild(reqBox);
    var reqSpan = el("span", "");
    reqSpan.appendChild(document.createTextNode(CONSENT_REQUIRED_PREFIX));
    var reqLink = el("a", "", CONSENT_REQUIRED_LINK);
    reqLink.href = PRIVACY_URL;
    reqLink.target = "_blank";
    reqLink.rel = "noopener";
    reqSpan.appendChild(reqLink);
    reqSpan.appendChild(document.createTextNode(CONSENT_REQUIRED_SUFFIX));
    reqLabel.appendChild(reqSpan);
    gate.appendChild(reqLabel);

    var mktLabel = el("label", "ac-consent");
    var mktBox = el("input", "");
    mktBox.type = "checkbox";
    mktLabel.appendChild(mktBox);
    mktLabel.appendChild(el("span", "", CONSENT_MARKETING_TEXT));
    gate.appendChild(mktLabel);

    var err = el("p", "ac-err", "");
    err.setAttribute("role", "alert");
    gate.appendChild(err);

    var btn = el("button", "btn", "Ver el resultado");
    btn.type = "button";
    gate.appendChild(btn);

    function submitGate() {
      var email = emailInput.value.trim();
      if (!email) { err.textContent = "Escribe tu email."; return; }
      if (!reqBox.checked) { err.textContent = "Para ver el resultado debes aceptar el uso de tu email para recibirlo."; return; }
      err.textContent = "";
      btn.disabled = true;

      postForm(UNLOCK_URL, {
        scanId: scanId,
        email: email,
        consentRequired: "true",
        consentMarketing: mktBox.checked ? "true" : "false",
        consentRequiredText: CONSENT_REQUIRED_TEXT,
        consentMarketingText: CONSENT_MARKETING_TEXT
      })
        .then(function (data) {
          if (data.ok === false) {
            err.textContent = data.error || "No se pudo mostrar el resultado.";
            btn.disabled = false;
            return;
          }
          currentEmail = email;
          gate.parentNode.removeChild(gate);
          var resultMsg = addMsg("");
          renderResult(resultMsg, data);
          finish();
        })
        .catch(function (e) {
          err.textContent = "No se pudo conectar. " + e.message;
          btn.disabled = false;
        });
    }
    btn.addEventListener("click", submitGate);
    emailInput.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter") { ev.preventDefault(); submitGate(); }
    });
    scrollDown();
    emailInput.focus();
  }

  // Paso 1: enviar la URL y mostrar los 7 puntos mientras se espera.
  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var value = input.value.trim();
    if (!value) return;
    currentUrl = value;

    go.disabled = true;
    input.disabled = true;

    var userMsg = addMsg("ac-user");
    userMsg.textContent = value;

    var botMsg = addMsg("");
    botMsg.appendChild(el("p", "", "Analizando tu web. Estoy revisando estos 7 puntos:"));
    var list = el("ul", "ac-checks");
    CHECKS.forEach(function (c) {
      var li = el("li", "");
      li.appendChild(el("span", "ac-spin"));
      li.appendChild(el("span", "", c));
      list.appendChild(li);
    });
    botMsg.appendChild(list);
    scrollDown();

    postForm(SCAN_URL, { url: value })
      .then(function (data) {
        if (data.ok === false || !data.scanId) {
          botMsg.textContent = "";
          botMsg.appendChild(el("p", "ac-bad", data.error || "No se pudo completar el análisis."));
          finish();
          return;
        }
        botMsg.firstChild.textContent = "Estos son los 7 puntos clave que he revisado:";
        var spins = botMsg.querySelectorAll(".ac-spin");
        for (var i = 0; i < spins.length; i++) { spins[i].className = "ac-dot"; }
        showGate(data.scanId);
      })
      .catch(function (e) {
        showTechnicalError(botMsg, e);
        finish();
      });
  });
})();
