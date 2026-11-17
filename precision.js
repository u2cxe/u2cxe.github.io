(() => {
 const fine=matchMedia('(hover:hover) and (pointer:fine)');if(!fine.matches)return;
 const reticle=document.createElement('div');reticle.className='precision-reticle';reticle.setAttribute('aria-hidden','true');
 reticle.innerHTML='<span class="reticle-frame"><i></i><i></i><i></i><i></i></span><span class="reticle-orbit"></span><span class="reticle-pulse"></span>';document.body.append(reticle);const spotlight=document.createElement('div');spotlight.className='pointer-spotlight';spotlight.setAttribute('aria-hidden','true');document.body.append(spotlight);
 let raf=0,x=0,y=0,active=false,kind='',owner=document.body;
 function hide(){active=false;cancelAnimationFrame(raf);raf=0;reticle.classList.remove('visible','pressed');}
 function paint(){raf=0;if(!active)return;reticle.style.transform=`translate3d(${x}px,${y}px,0)`;reticle.classList.add('visible');if(!document.body.classList.contains('calm'))spotlight.style.transform=`translate3d(${x-240}px,${y-240}px,0)`;}
 document.addEventListener('pointermove',e=>{
  if(e.pointerType!=='mouse'||!fine.matches){hide();return;}x=e.clientX;y=e.clientY;active=true;
  const nextOwner=e.target.closest('dialog[open]')||document.body;if(nextOwner!==owner){owner=nextOwner;owner.append(reticle);}
  const nextKind=e.target.closest('input,textarea,[contenteditable=true]')?'editing':e.target.closest('button,a,[role=button]')?'target':'';
  if(kind!==nextKind){reticle.classList.remove('target','editing');if(nextKind)reticle.classList.add(nextKind);kind=nextKind;}
  if(!raf)raf=requestAnimationFrame(paint);
 },{passive:true});
 document.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&active)reticle.classList.add('pressed');});document.addEventListener('pointerup',()=>{reticle.classList.remove('pressed');});
 const pulse=reticle.querySelector('.reticle-pulse');let burst;document.addEventListener('click',e=>{if(e.detail&&active&&!document.body.classList.contains('calm')){if(burst)burst.cancel();burst=pulse.animate([{opacity:.8,transform:'scale(.5)'},{opacity:0,transform:'scale(2)'}],{duration:450,easing:'ease-out'});}});
 document.addEventListener('pointerout',e=>{if(!e.relatedTarget)hide();});window.addEventListener('blur',hide);document.addEventListener('visibilitychange',()=>{if(document.hidden)hide();});fine.addEventListener('change',()=>{if(!fine.matches)hide();});
 document.querySelectorAll('dialog').forEach(d=>d.addEventListener('close',()=>{hide();owner=document.body;owner.append(reticle);}));
})();
