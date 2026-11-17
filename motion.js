(() => {
 const hero=document.querySelector('.hero'),terminal=document.querySelector('.hero-terminal');
 const boot=document.querySelector('#boot');const start=()=>{if(!boot||boot.classList.contains('x'))document.body.classList.add('motion-ready');};if(boot)new MutationObserver(start).observe(boot,{attributes:true,attributeFilter:['class']});start();
 const canvas=document.createElement('canvas');canvas.id='signal-field';canvas.setAttribute('aria-hidden','true');hero.prepend(canvas);
 const ctx=canvas.getContext('2d');let w=0,h=0,visible=true,frame=0,last=0,phase=0,mouse={x:.5,y:.5};
 function resize(){const r=hero.getBoundingClientRect();w=r.width;h=r.height;const d=Math.min(devicePixelRatio||1,1.5);canvas.width=w*d;canvas.height=h*d;ctx.setTransform(d,0,0,d,0,0);}
 new ResizeObserver(resize).observe(hero);
 const dots=Array.from({length:42},(_,i)=>({x:(i*.618)%1,y:(i*.381)%1,s:10+(i%5)*4}));
 function paint(time){frame=0;if(document.hidden||!visible)return;if(time-last<32){frame=requestAnimationFrame(paint);return;}last=time;if(!document.body.classList.contains('calm'))phase+=.018;ctx.clearRect(0,0,w,h);const ox=(mouse.x-.5)*25,oy=(mouse.y-.5)*20;ctx.lineWidth=.65;
  // Perspective lattice, flowing toward the viewer.
  const horizon=h*.32,cx=w*.47+ox;ctx.strokeStyle='rgba(255,65,90,.13)';
  for(let i=-10;i<=10;i++){ctx.beginPath();ctx.moveTo(cx+i*13,horizon);ctx.lineTo(cx+i*w*.17,h);ctx.stroke();}
  for(let i=0;i<15;i++){const z=((i/15+phase*.025)%1);const y=horizon+z*z*(h-horizon);ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
  // Orbiting data points and short-lived connections.
  const p=dots.map((d,i)=>({x:(d.x*w+Math.sin(phase*.3+i)*d.s+ox+w)%w,y:(d.y*h-phase*d.s+oy+h*100)%h}));
  p.forEach((a,i)=>{ctx.fillStyle=i%4?'rgba(255,70,96,.6)':'rgba(255,186,140,.8)';ctx.beginPath();ctx.arc(a.x,a.y,i%4?1.3:2,0,Math.PI*2);ctx.fill();for(let j=i+1;j<p.length;j++){const b=p[j],dist=Math.hypot(a.x-b.x,a.y-b.y);if(dist<145){ctx.strokeStyle=`rgba(255,65,90,${(1-dist/145)*.18})`;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}}});
  if(!document.body.classList.contains('calm'))frame=requestAnimationFrame(paint);
 }
 const wake=()=>{if(!frame&&visible&&!document.hidden)frame=requestAnimationFrame(paint);};
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)wake();}).observe(hero);
 document.addEventListener('visibilitychange',wake);new MutationObserver(wake).observe(document.body,{attributes:true,attributeFilter:['class']});
 hero.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'||document.body.classList.contains('calm'))return;const r=hero.getBoundingClientRect();mouse={x:(e.clientX-r.left)/r.width,y:(e.clientY-r.top)/r.height};},{passive:true});
 const orbit=document.createElement('div');orbit.className='orbit-mark';orbit.innerHTML='<span class="orbit-disc" aria-hidden="true">⌘</span><span><strong>EXPLORE THE OPERATOR</strong>Type a command. Discover the story.</span>';document.querySelector('.hero .hc').append(orbit);
 const activity=document.createElement('div');activity.className='console-activity';activity.setAttribute('aria-hidden','true');activity.innerHTML='<span class="console-spectrum">'+Array.from({length:16},(_,i)=>`<i style="--i:${i}"></i>`).join('')+'</span><span class="activity-label">AWAITING COMMAND</span><b>LOCAL SESSION</b>';terminal.append(activity);
 let timer;const label=activity.querySelector('.activity-label');const out=document.querySelector('#hero-output');
 new MutationObserver(records=>{if(!records.some(r=>r.addedNodes.length))return;activity.classList.add('busy');label.textContent='RESPONSE RECEIVED';clearTimeout(timer);timer=setTimeout(()=>{activity.classList.remove('busy');label.textContent='AWAITING COMMAND';},1100);}).observe(out,{childList:true});
 const panels=[...document.querySelectorAll('.cred,.card,.lab-shell,.academic-award,.achievement-console,.mission-panel,.operator-id')];
 panels.forEach(el=>{el.classList.add('motion-panel');el.addEventListener('pointermove',e=>{if(document.body.classList.contains('calm'))return;const r=el.getBoundingClientRect();el.style.setProperty('--glow-x',`${e.clientX-r.left}px`);el.style.setProperty('--glow-y',`${e.clientY-r.top}px`);},{passive:true});});
 const reveal=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('motion-enter');reveal.unobserve(e.target);}});},{threshold:.1});
 document.querySelectorAll('.sec h2,.sec .sub,.cred,.card,.lab-shell,.mission-panel,.operator-id').forEach((el,i)=>{el.style.setProperty('--entrance-delay',`${i%3*85}ms`);reveal.observe(el);});
 document.addEventListener('click',e=>{if(document.body.classList.contains('calm')||!e.target.closest('button,a')||!e.detail)return;const wave=document.createElement('i');wave.className='click-wave';wave.setAttribute('aria-hidden','true');wave.style.left=e.clientX+'px';wave.style.top=e.clientY+'px';(document.querySelector('dialog[open]')||document.body).append(wave);setTimeout(()=>wave.remove(),650);});
 resize();wake();
})();
