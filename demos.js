/* vídeos: con data-src el vídeo sustituye a la simulación */
[].forEach.call(document.querySelectorAll('.player,.cvid'),function(pl){
  var src=pl.dataset.src;if(!src)return;
  var v=document.createElement('video');v.controls=true;v.playsInline=true;v.preload='metadata';
  if(pl.dataset.poster)v.poster=pl.dataset.poster;
  if(pl.dataset.captions){var t=document.createElement('track');t.kind='captions';t.src=pl.dataset.captions;t.srclang='es';t.label='Español';t.default=true;v.appendChild(t)}
  v.addEventListener('loadedmetadata',function(){pl.textContent='';pl.appendChild(v);pl.hidden=false;var fg=pl.closest('figure');if(fg)fg.hidden=false});
  v.addEventListener('error',function(){console.warn('demos.js: no se pudo cargar el vídeo',src,'(¿ruta, subida o códec H.264/AAC?)')});
  v.src=src;
});
/* simulación: tipo de negocio (desaparece al poner el vídeo) */
(function(){
  var box=document.getElementById('v1');if(!box)return;
  var d={rest:['Dame los mejores restaurantes de Madrid cerca de Retiro','Estos son algunos restaurantes cerca del Retiro:','Restaurante A','Restaurante C'],barb:['Recomiéndame una barbería en Madrid con hueco hoy','Estas barberías tienen hueco hoy:','Barbería A','Barbería C'],shop:['¿Dónde compro zapatillas de running en Madrid con envío para mañana?','Estas tiendas tienen stock y envío para mañana:','Tienda A','Tienda C']};
  var me=document.getElementById('c-me'),intro=document.getElementById('c-intro'),list=document.getElementById('c-list'),bs=box.querySelectorAll('.tabs button');
  [].forEach.call(bs,function(b){b.addEventListener('click',function(){
    var x=d[b.dataset.k];me.textContent=x[0];intro.textContent=x[1];list.children[0].textContent=x[2];list.children[2].textContent=x[3];
    [].forEach.call(bs,function(o){o.setAttribute('aria-pressed',String(o===b))});
  })});
})();
