/* Sample the pointer once per frame. No left/top transitions or queued easing. */
(() => {
 if(!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
 const trail=document.createElement('div');trail.className='neon-trail';trail.setAttribute('aria-hidden','true');
 const dots=Array.from({length:3},(_,i)=>{const dot=document.createElement('i');dot.style.setProperty('--size',`${5-i}px`);dot.style.opacity=String(.5-i*.12);trail.append(dot);return dot;});
 document.body.append(trail);
 let frame=0,last=0,previous=0,x=0,y=0,seed=true,link=false;
 const points=dots.map(()=>({x:0,y:0}));
 function hide(){cancelAnimationFrame(frame);frame=0;seed=true;previous=0;trail.classList.remove('visible');}
 function draw(time){frame=0;if(document.hidden||document.body.classList.contains('calm')||time-last>110){hide();return;}
  const dt=previous?Math.min(40,time-previous):16.7;previous=time;
  dots.forEach((dot,i)=>{const target=i?points[i-1]:{x,y};const alpha=1-Math.exp(-dt/(12+i*8));points[i].x+=(target.x-points[i].x)*alpha;points[i].y+=(target.y-points[i].y)*alpha;dot.style.transform=`translate3d(${points[i].x+7}px,${points[i].y+10}px,0)`;});
  trail.classList.add('visible');trail.classList.toggle('over-link',link);frame=requestAnimationFrame(draw);
 }
 document.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'||document.body.classList.contains('calm')){hide();return;}
  x=e.clientX;y=e.clientY;last=performance.now();link=!!e.target.closest('button,a,[role=button]');
  const owner=e.target.closest('dialog[open]')||document.body;
  if(trail.parentElement!==owner){owner.append(trail);seed=true;}
  if(seed){points.forEach(p=>{p.x=x;p.y=y;});seed=false;}
  if(!frame)frame=requestAnimationFrame(draw);
 },{passive:true});
 document.addEventListener('pointerleave',hide);window.addEventListener('blur',hide);window.addEventListener('scroll',hide,{passive:true});document.addEventListener('visibilitychange',hide);
 new MutationObserver(()=>{if(document.body.classList.contains('calm'))hide();}).observe(document.body,{attributes:true,attributeFilter:['class']});
 document.querySelectorAll('dialog').forEach(d=>d.addEventListener('close',()=>{hide();document.body.append(trail);}));
})();
