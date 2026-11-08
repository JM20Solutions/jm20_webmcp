/* webmcp_form.js — formulario de auditoría JM20 → Supabase (public.leads_webmcp) */
(function(){
  var f=document.getElementById('audit-form'),st=document.getElementById('fstatus'),done=document.getElementById('fok'),b=f.querySelector('button'),label=b.textContent;
  var names=['nombre','empresa','url','email','tamano','consentimiento'];
  var msgs={nombre:'Escribe tu nombre.',empresa:'Escribe el nombre de tu empresa.',url:'Escribe la web de tu negocio, por ejemplo minegocio.es.',email:'Escribe un email válido, por ejemplo nombre@empresa.es.',tamano:'Elige el tamaño de tu empresa.',consentimiento:'Acepta la política de privacidad para continuar.'};
  function normUrl(v){v=v.trim();if(!v)return '';if(!/^https?:\/\//i.test(v))v='https://'+v;try{var u=new URL(v);return u.hostname.indexOf('.')>0?u.href:''}catch(e){return ''}}
  function fields(n){var e=f.elements[n];return e.length?[].slice.call(e):[e]}
  function check(n){
    var e=f.elements[n],ok;
    if(n==='url')ok=!!normUrl(e.value);
    else if(n==='email')ok=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.value.trim());
    else if(n==='tamano')ok=!!f.querySelector('input[name=tamano]:checked');
    else if(n==='consentimiento')ok=e.checked;
    else ok=!!e.value.trim();
    var p=document.getElementById('e-'+n);p.textContent=ok?'':msgs[n];p.hidden=ok;
    fields(n).forEach(function(i){i.setAttribute('aria-invalid',String(!ok))});
    return ok;
  }
  function fail(m){st.textContent=m;st.hidden=false;b.disabled=false;b.textContent=label}
  f.addEventListener('input',function(e){var n=e.target.name;if(n&&e.target.getAttribute('aria-invalid')==='true')check(n)});
  f.addEventListener('submit',function(e){
    e.preventDefault();st.hidden=true;
    var bad=names.filter(function(n){return !check(n)});
    if(bad.length){fields(bad[0])[0].focus();return}
    f.elements.url.value=normUrl(f.elements.url.value);
    b.disabled=true;b.textContent='Enviando…';
    var ep=f.dataset.endpoint;
    if(!ep){console.warn('audit-form: falta data-endpoint');fail('No hemos podido enviar tu solicitud ahora mismo. Inténtalo de nuevo en unos minutos.');return}
    var key=f.dataset.apikey;
    var body={nombre:f.elements.nombre.value.trim(),empresa:f.elements.empresa.value.trim(),url:f.elements.url.value,email:f.elements.email.value.trim(),tamano:f.querySelector('input[name=tamano]:checked').value,consentimiento:true};
    /* Con claves sb_publishable_* basta el header apikey (no son JWT, no uses Authorization: Bearer) */
    var h={'Content-Type':'application/json',Prefer:'return=minimal'};if(key)h.apikey=key;
    fetch(ep,{method:'POST',headers:h,body:JSON.stringify(body)})
      .then(function(r){
        if(r.ok){f.hidden=true;done.hidden=false;done.focus();return}
        return r.text().then(function(t){console.error('audit-form: Supabase respondió',r.status,t);throw r.status});
      })
      .catch(function(s){
        if(typeof s!=='number')console.error('audit-form: error de red/CORS',s);
        fail(typeof s==='number'?'Tu solicitud no se ha podido registrar. Inténtalo de nuevo en unos minutos.':'No hemos podido enviar tu solicitud. Revisa tu conexión e inténtalo de nuevo.');
      });
  });
})();
