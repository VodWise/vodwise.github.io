// Pestañas de la página de funciones (los tres idiomas).
(()=>{const tabs=[...document.querySelectorAll('.fn-tab')],panels=[...document.querySelectorAll('.fn-panel')];const ids=tabs.map(t=>t.dataset.tab);
      const show=id=>{if(!ids.includes(id))id=ids[0];tabs.forEach(t=>{const on=t.dataset.tab===id;t.classList.toggle('on',on);t.setAttribute('aria-selected',on);});panels.forEach(p=>{p.hidden=p.id!=='fn-'+id;});
        if(history.replaceState)history.replaceState(null,'','#'+id);const b=document.querySelector('.fn-tab.on');if(b&&b.scrollIntoView&&window.innerWidth<860)b.scrollIntoView({block:'nearest',inline:'center'});};
      tabs.forEach(t=>t.addEventListener('click',()=>show(t.dataset.tab)));
      document.querySelectorAll('.fn-prev,.fn-next').forEach(b=>b.addEventListener('click',()=>{const cur=ids.indexOf(document.querySelector('.fn-tab.on')?.dataset.tab);show(ids[(cur+(b.classList.contains('fn-next')?1:ids.length-1))%ids.length]);window.scrollTo({top:document.querySelector('.fn-layout').offsetTop-80,behavior:'smooth'});}));
      show(location.hash.slice(1));addEventListener('hashchange',()=>show(location.hash.slice(1)));})();
