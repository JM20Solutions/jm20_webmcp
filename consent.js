/* consent.js — consentimiento de cookies/analítica (LSSI + RGPD).
   Sin scripts configurados en CONFIG.scripts NO muestra nada: el sitio actual
   no usa cookies de terceros, así que no hace falta banner hasta que añadas analítica. */
(function(){
  var CONFIG={
    key:'jm20-consent-v1',
    privacy:'https://jm20aisolutions.com/politica-de-privacidad.html',
    /* Scripts que SOLO se cargan tras aceptar. Ejemplo (Plausible):
       {src:'https://plausible.io/js/script.js',attrs:{'data-domain':'jm20aisolutions.com'}}
       Recuerda añadir ese host a script-src y connect-src en _headers. */
    scripts:[]
  };
  if(!CONFIG.scripts.length)return;

  function read(){try{return localStorage.getItem(CONFIG.key)}catch(e){return null}}
  function write(v){try{localStorage.setItem(CONFIG.key,v)}catch(e){}}
  function load(){
    CONFIG.scripts.forEach(function(s){
      var el=document.createElement('script');el.src=s.src;el.async=true;
      Object.keys(s.attrs||{}).forEach(function(k){el.setAttribute(k,s.attrs[k])});
      document.head.appendChild(el);
    });
  }
  function ask(){
    var old=document.getElementById('cc');if(old)old.remove();
    var box=document.createElement('div');box.id='cc';box.className='cc';
    box.setAttribute('role','dialog');box.setAttribute('aria-label','Cookies');
    var p=document.createElement('p');
    p.appendChild(document.createTextNode('Usamos analítica para entender cómo se usa la web. Solo se activa si la aceptas. '));
    var a=document.createElement('a');a.href=CONFIG.privacy;a.textContent='Más información';
    p.appendChild(a);
    var row=document.createElement('div');row.className='cc-b';
    function btn(label,val){
      var b=document.createElement('button');b.type='button';b.textContent=label;
      b.addEventListener('click',function(){write(val);box.remove();if(val==='yes')load()});
      row.appendChild(b);
    }
    btn('Rechazar','no');btn('Aceptar','yes');
    box.appendChild(p);box.appendChild(row);document.body.appendChild(box);
  }

  var v=read();
  if(v==='yes')load();else if(v!=='no')ask();
  /* enlace "Configurar cookies" en el pie: <a href="#" data-consent-open> */
  document.addEventListener('click',function(e){
    var t=e.target.closest&&e.target.closest('[data-consent-open]');
    if(t){e.preventDefault();ask()}
  });
})();
