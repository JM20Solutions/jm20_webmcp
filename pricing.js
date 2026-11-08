/* cajas de precios: "Pedir auditoría" deja marcado el tamaño de empresa en el formulario */
(function(){
  var radios=document.querySelectorAll('input[name=tamano]');
  [].forEach.call(document.querySelectorAll('[data-size]'),function(a){
    a.addEventListener('click',function(){
      [].forEach.call(radios,function(r){
        var on=r.value===a.dataset.size;r.checked=on;
        if(on)r.dispatchEvent(new Event('input',{bubbles:true}));
      });
    });
  });
})();
