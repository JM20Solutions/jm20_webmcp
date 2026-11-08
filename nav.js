/* sección activa en el menú y CTA fijo en móvil */
(function(){
  if(!('IntersectionObserver' in window))return;
  var links={},all=document.querySelectorAll('.global nav a');
  [].forEach.call(all,function(a){links[a.hash.slice(1)]=a});links.agentes=links.demo;
  var spy=new IntersectionObserver(function(es){es.forEach(function(e){
    if(!e.isIntersecting)return;
    [].forEach.call(all,function(a){a.removeAttribute('aria-current')});
    var a=links[e.target.id];if(a)a.setAttribute('aria-current','true');
  })},{rootMargin:'-45% 0px -50% 0px'});
  ['demo','agentes','metodo','ecosistema','audit'].forEach(function(id){spy.observe(document.getElementById(id))});
  var dock=document.getElementById('dock'),seen={};
  var io=new IntersectionObserver(function(es){es.forEach(function(e){seen[e.target.id]=e.isIntersecting});
    dock.hidden=Object.keys(seen).some(function(k){return seen[k]});
  });
  ['top','audit','foot'].forEach(function(id){io.observe(document.getElementById(id))});
})();
