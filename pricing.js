/* precios: un selector de tamaño muestra un solo plan; "Solicitar auditoría" deja marcado el tamaño en el formulario */
(function(){
  document.documentElement.classList.add('js');
  var picks=document.querySelectorAll('[data-pick]'),plans=document.querySelectorAll('.plan[data-plan]'),radios=document.querySelectorAll('input[name=tamano]');
  function show(k){
    [].forEach.call(plans,function(p){p.hidden=p.dataset.plan!==k});
    [].forEach.call(picks,function(b){b.setAttribute('aria-pressed',String(b.dataset.pick===k))});
  }
  [].forEach.call(picks,function(b){b.addEventListener('click',function(){show(b.dataset.pick)})});
  [].forEach.call(radios,function(r){r.addEventListener('change',function(){if(r.checked)show(r.value)})});
  [].forEach.call(document.querySelectorAll('[data-size]'),function(a){
    a.addEventListener('click',function(){
      [].forEach.call(radios,function(r){
        var on=r.value===a.dataset.size;r.checked=on;
        if(on)r.dispatchEvent(new Event('input',{bubbles:true}));
      });
    });
  });
  show('pequeno');
})();
