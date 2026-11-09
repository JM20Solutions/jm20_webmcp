/* menú móvil, sección activa en el menú y CTA fijo en móvil */
(function(){
  var nav=document.querySelector('nav.global'),mn=document.getElementById('mnav');
  if(nav&&mn){
    mn.addEventListener('click',function(){var o=nav.classList.toggle('open');mn.setAttribute('aria-expanded',String(o));mn.setAttribute('aria-label',o?'Cerrar menú':'Abrir menú')});
    [].forEach.call(nav.querySelectorAll('.navlinks a'),function(a){a.addEventListener('click',function(){nav.classList.remove('open');mn.setAttribute('aria-expanded','false')})});
  }
  if(!('IntersectionObserver' in window))return;
  var links={},all=document.querySelectorAll('.navlinks a:not(.btn)');
  [].forEach.call(all,function(a){links[a.hash.slice(1)]=a});links.agentes=links.demo;links.beneficios=links.demo;
  var spy=new IntersectionObserver(function(es){es.forEach(function(e){
    if(!e.isIntersecting)return;
    [].forEach.call(all,function(a){a.removeAttribute('aria-current')});
    var a=links[e.target.id];if(a)a.setAttribute('aria-current','true');
  })},{rootMargin:'-45% 0px -50% 0px'});
  ['demo','beneficios','agentes','metodo','ecosistema'].forEach(function(id){spy.observe(document.getElementById(id))});
  var dock=document.getElementById('dock'),seen={};
  var io=new IntersectionObserver(function(es){es.forEach(function(e){seen[e.target.id]=e.isIntersecting});
    dock.hidden=Object.keys(seen).some(function(k){return seen[k]});
  });
  ['top','audit','foot'].forEach(function(id){io.observe(document.getElementById(id))});
})();
