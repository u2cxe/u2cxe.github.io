/* Update these values when your TryHackMe profile changes. */
const THM_PROFILE = { topPercent: 5, badges: 27, rooms: 100, roomsSuffix: '+', updated: 'November 17, 2026', url: 'https://tryhackme.com/p/u2cxe' };
(() => {
  const q=s=>document.querySelector(s), all=s=>[...document.querySelectorAll(s)];
  const section=q('#achievements');
  const metrics=[
    {key:'rank',label:'Global standing',value:THM_PROFILE.topPercent,prefix:'Top ',suffix:'%',title:'Building momentum.',text:'Among the top '+THM_PROFILE.topPercent+'% of TryHackMe users. A milestone in a learning journey that keeps moving.',caption:'GLOBAL RANKING',kind:'rank'},
    {key:'badges',label:'Badges earned',value:THM_PROFILE.badges,prefix:'',suffix:'',title:'Milestones collected.',text:THM_PROFILE.badges+' badges earned on TryHackMe. Each marker below represents one earned badge; see the profile for the official badge collection.',caption:'BADGE COUNT / '+THM_PROFILE.badges+' EARNED',kind:'badges'},
    {key:'rooms',label:'Rooms completed',value:THM_PROFILE.rooms,prefix:'',suffix:THM_PROFILE.roomsSuffix,title:'Learning through practice.',text:THM_PROFILE.rooms+THM_PROFILE.roomsSuffix+' rooms completed. Hands-on practice is the foundation of my cybersecurity learning.',caption:'COMPLETED ROOMS / '+THM_PROFILE.rooms+THM_PROFILE.roomsSuffix,kind:'rooms'}
  ];
  q('#thm-date').textContent='PROFILE SNAPSHOT · '+THM_PROFILE.updated.toUpperCase();
  all('[data-thm-link]').forEach(a=>a.href=THM_PROFILE.url);
  const countNodes=[];
  metrics.forEach((m,i)=>{
    const b=document.createElement('button');b.type='button';b.className='achievement-metric';b.id='metric-'+m.key;b.setAttribute('role','tab');b.setAttribute('aria-controls','achievement-panel');b.setAttribute('aria-selected',String(i===0));b.tabIndex=i===0?0:-1;
    const num=document.createElement('strong');num.textContent=m.prefix+m.value+m.suffix;num.setAttribute('aria-hidden','true');
    b.setAttribute('aria-label',m.prefix+m.value+m.suffix+' '+m.label);
    const label=document.createElement('span');label.textContent=m.label;
    const index=document.createElement('small');index.textContent='0'+(i+1)+' / TRYHACKME';
    b.append(index,num,label);q('#achievement-tabs').append(b);countNodes.push(num);
    b.onclick=()=>select(i);
    b.onkeydown=e=>{let next;if(e.key==='ArrowRight')next=(i+1)%3;if(e.key==='ArrowLeft')next=(i+2)%3;if(e.key==='Home')next=0;if(e.key==='End')next=2;if(next!==undefined){e.preventDefault();select(next);all('.achievement-metric')[next].focus();}};
  });
  let current=0;
  function select(i){current=i;const m=metrics[i];all('.achievement-metric').forEach((b,j)=>{b.setAttribute('aria-selected',String(i===j));b.tabIndex=i===j?0:-1;});const panel=q('#achievement-panel');panel.setAttribute('aria-labelledby','metric-'+m.key);panel.dataset.mode=m.kind;q('#achievement-title').textContent=m.title;q('#achievement-copy').textContent=m.text;q('#achievement-caption').textContent=m.caption;const art=q('#achievement-art');art.replaceChildren();
    if(m.kind==='rank'){
      art.innerHTML='<div class="rank-orbit"><div class="orbit-track"></div><div class="orbit-core"><small>TRYHACKME</small><strong>TOP '+m.value+'<em>%</em></strong><span>GLOBAL STANDING</span></div><i class="orbit-satellite"></i></div>';
    }else{
      const grid=document.createElement('div');grid.className=m.kind==='badges'?'badge-matrix':'room-matrix';
      const amount=m.kind==='badges'?m.value:m.value;
      for(let n=0;n<amount;n++){const dot=document.createElement('i');dot.style.setProperty('--n',String(n));if(m.kind==='badges')dot.textContent=String(n+1).padStart(2,'0');grid.append(dot);}art.append(grid);
    }
    if(!calm&&panel.animate)panel.animate([{opacity:.45,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:280,easing:'ease-out'});
  }
  select(0);
  let counted=false;
  const obs=new IntersectionObserver(es=>{if(!es[0].isIntersecting||counted)return;counted=true;obs.disconnect();const start=performance.now();function frame(t){const p=calm?1:Math.min((t-start)/1400,1),eased=1-Math.pow(1-p,3);metrics.forEach((m,i)=>countNodes[i].textContent=m.prefix+Math.round(m.value*eased)+m.suffix);if(p<1)requestAnimationFrame(frame);}requestAnimationFrame(frame);},{threshold:.2});obs.observe(q('#achievement-tabs'));
  const chips=document.createElement('a');chips.href='#achievements';chips.className='hero-achievement';chips.innerHTML='<span class="achievement-pulse"></span><b>TRYHACKME</b> TOP '+THM_PROFILE.topPercent+'% <i>/</i> '+THM_PROFILE.badges+' BADGES <i>/</i> '+THM_PROFILE.rooms+THM_PROFILE.roomsSuffix+' ROOMS <span>↗</span>';q('.hero .lead').after(chips);
  sections.splice(2,0,['achievements','TryHackMe ranking, badges and rooms']);
  C.stats=()=>`TryHackMe @u2cxe\nTop ${THM_PROFILE.topPercent}% globally\n${THM_PROFILE.badges} badges earned\n${THM_PROFILE.rooms}${THM_PROFILE.roomsSuffix} rooms completed\nUpdated: ${THM_PROFILE.updated}\n${THM_PROFILE.url}`;
  const oldHelp=C.help;C.help=()=>oldHelp()+'  stats';
  const quick=document.createElement('button');quick.type='button';quick.className='control';quick.textContent='stats';quick.onclick=()=>{ci.value='stats';ci.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}));ci.focus();};q('.console-shortcuts').append(quick);
  const navLink=document.createElement('a');navLink.href='#achievements';navLink.textContent='awards';q('nav a[href="#weapon"]').after(navLink);
  navLink.onclick=()=>{q('nav').classList.remove('expanded');q('#mobile-menu').setAttribute('aria-expanded','false');q('#mobile-menu').textContent='Menu +';};
  // Keyboard-accessible tab controls are mirrored in the section navigator.

  all('#achievements .rv').forEach(n=>io.observe(n));
  // A sweep on section headings and a small click wave make navigation tangible.
  all('.sec h2').forEach(h=>{h.classList.add('kinetic-heading');const watch=new IntersectionObserver(es=>{es.forEach(e=>h.classList.toggle('heading-visible',e.isIntersecting));},{threshold:.5});watch.observe(h);});
  document.addEventListener('click',e=>{const button=e.target.closest('button,.btn');if(!button||button.disabled||calm)return;const r=button.getBoundingClientRect();const wave=document.createElement('span');wave.className='click-wave';wave.setAttribute('aria-hidden','true');const size=Math.max(r.width,r.height);wave.style.width=wave.style.height=size+'px';wave.style.left=((e.detail?e.clientX-r.left:r.width/2)-size/2)+'px';wave.style.top=((e.detail?e.clientY-r.top:r.height/2)-size/2)+'px';button.append(wave);setTimeout(()=>wave.remove(),650);});
  const sectionWatch=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)all('nav a[href^="#"]').forEach(a=>a.classList.toggle('nav-active',a.hash==='#'+e.target.id));}),{rootMargin:'-15% 0px -65% 0px'});all('main>section[id]').forEach(n=>sectionWatch.observe(n));
  // Decorative loops sleep when the achievements are off-screen.
  new IntersectionObserver(es=>section.classList.toggle('achievements-visible',es[0].isIntersecting)).observe(section);
  q('.edition').textContent='U2CXE / RED TEAM JOURNAL';
})();
