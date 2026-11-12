/* Interactive edition. Educational examples only; no network requests are made. */
(() => {
  const q = s => document.querySelector(s);
  const el = (tag, cls, text) => { const n=document.createElement(tag); n.className=cls||''; if(text)n.textContent=text; return n; };
  // Motion starts enabled on every page load; visitors can pause it for this visit.
  q('.edition').textContent='U2CXE / INTERACTIVE EDITION';
  q('.hero').insertAdjacentHTML('beforeend','<div class="hero-coordinate" aria-hidden="true">31.95° N / 35.93° E<br>AMMAN · JORDAN</div>');
  const identity=el('div','operator-id');
  identity.innerHTML='<span class="identity-prompt">$ whoami</span><strong>Abdulrahman Ghanayem<span class="typing-caret" aria-hidden="true">_</span></strong><span class="identity-focus">Red Team <i>·</i> Penetration Tester <i>·</i> Network Pentester</span>';
  q('#recon .about').before(identity);
  const ticker=el('div','signal-strip');ticker.setAttribute('aria-hidden','true');
  ticker.innerHTML='<div>'+Array.from({length:2},()=>'<span>NETWORK INTELLIGENCE</span><i>✳</i><span>THINK OFFENSIVELY</span><i>✳</i><span>LEARN. TEST. REPEAT.</span><i>✳</i><span>U2CXE</span><i>✳</i>').join('')+'</div>';
  q('.mission-panel').after(ticker);

  // Protocol lab: every frame is deterministic, selectable and explained.
  const protocols={
    TCP:{title:'The three-way handshake',endpoint:'LAB SERVER',summary:'Before exchanging data, two hosts agree to open a reliable connection.',filter:'tcp.flags.syn == 1 || tcp.flags.ack == 1',frames:[
      {dir:1,flag:'SYN',detail:'The client asks to start a connection and supplies its initial sequence number.',wire:'49152 → 443 · Seq=100 · SYN=1',layer:'Transport / TCP'},
      {dir:-1,flag:'SYN / ACK',detail:'The server acknowledges the client and supplies its own initial sequence number.',wire:'443 → 49152 · Seq=700 · Ack=101',layer:'Transport / TCP'},
      {dir:1,flag:'ACK',detail:'The client acknowledges the server. The TCP connection is now established.',wire:'49152 → 443 · Seq=101 · Ack=701',layer:'Transport / TCP'}]},
    DNS:{title:'From a name to an address',endpoint:'DNS RESOLVER',summary:'A browser needs an IP address before it can connect to a named host.',filter:'dns',frames:[
      {dir:1,flag:'A QUERY',detail:'The client asks the resolver for the IPv4 address of lab.example.',wire:'53000 → 53 · UDP · A lab.example',layer:'Application / DNS'},
      {dir:-1,flag:'A ANSWER',detail:'The resolver returns an example address. Documentation-only addresses are used in this simulation.',wire:'53 → 53000 · A 192.0.2.10 · TTL 300',layer:'Application / DNS'}]},
    HTTP:{title:'A request. A response.',endpoint:'WEB SERVER',summary:'A simplified HTTP/1.1 exchange after a connection has already been established.',filter:'http',frames:[
      {dir:1,flag:'GET /',detail:'The client requests the homepage. The Host header identifies the website.',wire:'GET / HTTP/1.1 · Host: lab.example',layer:'Application / HTTP'},
      {dir:-1,flag:'200 OK',detail:'The server returns a successful response and an HTML document. HTTPS would protect this exchange with TLS.',wire:'HTTP/1.1 200 OK · Content-Type: text/html',layer:'Application / HTTP'}]}
  };
  const lab=el('section','sec packet-lab');lab.id='packet-lab';lab.dataset.l='packet lab';
  lab.innerHTML=`<div class="lab-heading"><div><p class="ph">interactive / packet lab</p><h2>Go beneath<br>the surface.</h2></div><p class="sub">Follow a packet. Inspect the exchange. See the protocols behind the tools.</p></div>
    <div class="lab-shell"><div class="lab-bar"><span><i class="live-dot"></i> PACKET EXPLORER</span><span>LOCAL SIMULATION</span></div>
    <div class="protocol-tabs" role="group" aria-label="Select protocol"></div>
    <div class="lab-intro"><h3 id="protocol-title"></h3><p id="protocol-summary"></p></div>
    <div class="packet-stage"><div class="endpoint"><span class="endpoint-icon">&gt;_</span><strong>CLIENT</strong><small>192.0.2.25</small></div><div class="packet-route"><div class="route-line"></div><span class="packet-token" aria-hidden="true">SYN</span><span class="route-caption">Ready to trace</span></div><div class="endpoint"><span class="endpoint-icon">▤</span><strong id="endpoint-name"></strong><small>192.0.2.10</small></div></div>
    <div class="lab-controls"><button type="button" class="btn" id="trace-play">Run trace ↗</button><button type="button" class="btn g" id="trace-step">Next packet →</button><button type="button" class="control" id="trace-reset">Reset ↻</button><label class="speed-label">Speed <select id="trace-speed"><option value="1">1×</option><option value="2">2×</option><option value="0.5">0.5×</option></select></label></div>
    <div class="packet-progress"><span></span></div><div class="trace-detail"><div><p class="mini-label">CAPTURE / SELECT TO INSPECT</p><div id="packet-list"></div></div><div class="packet-inspector" aria-live="polite"><span class="mini-label">PACKET INSPECTOR</span><h4 id="packet-label">Waiting for capture</h4><code id="packet-wire">Choose a protocol and run the trace.</code><p id="packet-explanation">You can also advance one packet at a time.</p><span id="packet-layer"></span></div></div><div class="filter-hint"><span>WIRESHARK DISPLAY FILTER</span><code id="filter-value"></code></div></div>`;
  q('#weapon').after(lab);
  let protocol='TCP',cursor=0,playing=false,progress=0,last=0,speed=1,inView=false;
  const token=q('.packet-token'),route=q('.packet-route'),play=q('#trace-play');
  new IntersectionObserver(es=>{inView=es[0].isIntersecting;last=0;},{rootMargin:'60px'}).observe(lab);
  function inspect(index){const f=protocols[protocol].frames[index];q('#packet-label').textContent=f.flag;q('#packet-wire').textContent=f.wire;q('#packet-explanation').textContent=f.detail;q('#packet-layer').textContent=f.layer;document.querySelectorAll('.packet-row').forEach((b,i)=>{b.classList.toggle('selected',i===index);b.setAttribute('aria-pressed',String(i===index));});}
  function updatePlay(){play.textContent=playing?'Pause trace Ⅱ':cursor>=protocols[protocol].frames.length?'Replay trace ↻':cursor?'Resume trace ↗':'Run trace ↗';play.setAttribute('aria-pressed',String(playing));}
  function capture(){const f=protocols[protocol].frames[cursor];const row=el('button','packet-row');row.type='button';row.innerHTML=`<span>0${cursor+1}</span><b>${f.flag}</b><span>${f.dir===1?'CLIENT → SERVER':'SERVER → CLIENT'}</span>`;const idx=cursor;row.onclick=()=>inspect(idx);q('#packet-list').append(row);inspect(cursor);cursor++;progress=0;token.style.opacity='0';q('.packet-progress span').style.width=cursor/protocols[protocol].frames.length*100+'%';q('.route-caption').textContent=cursor===protocols[protocol].frames.length?'Exchange complete':`${cursor} packet${cursor===1?'':'s'} captured`;if(cursor===protocols[protocol].frames.length)playing=false;updatePlay();}
  function reset(){playing=false;cursor=0;progress=0;last=0;token.style.opacity='0';q('#packet-list').replaceChildren();q('#packet-label').textContent='Waiting for capture';q('#packet-wire').textContent='Choose a protocol and run the trace.';q('#packet-explanation').textContent='You can also advance one packet at a time.';q('#packet-layer').textContent='';q('.packet-progress span').style.width='0%';q('.route-caption').textContent='Ready to trace';updatePlay();}
  function select(name){protocol=name;reset();const p=protocols[name];q('#protocol-title').textContent=p.title;q('#protocol-summary').textContent=p.summary;q('#endpoint-name').textContent=p.endpoint;q('#filter-value').textContent=p.filter;document.querySelectorAll('.protocol-tab').forEach(b=>b.setAttribute('aria-pressed',String(b.textContent===name)));}
  Object.keys(protocols).forEach(name=>{const b=el('button','protocol-tab',name);b.type='button';b.onclick=()=>select(name);q('.protocol-tabs').append(b);});
  play.onclick=()=>{if(cursor>=protocols[protocol].frames.length)reset();playing=!playing;last=0;updatePlay();};
  q('#trace-reset').onclick=reset;q('#trace-speed').onchange=e=>speed=+e.target.value;
  q('#trace-step').onclick=()=>{playing=false;if(cursor>=protocols[protocol].frames.length)reset();capture();};
  function tick(time){requestAnimationFrame(tick);if(!playing||!inView||document.hidden){last=0;return;}const delta=last?Math.min(time-last,70):0;last=time;progress+=delta*speed/1800;const f=protocols[protocol].frames[cursor];token.textContent=f.flag;token.style.opacity=calm?'0':'1';const fraction=f.dir===1?progress:1-progress;token.style.left=Math.max(0,Math.min(1,fraction))*(route.clientWidth-token.offsetWidth)+'px';q('.route-caption').textContent=f.dir===1?'Client → server':'Server → client';if(progress>=1)capture();}
  select('TCP');requestAnimationFrame(tick);

  // Small knowledge challenge with feedback, no invented achievement claims.
  const quiz=el('div','network-challenge');
  quiz.innerHTML='<div><p class="ph">quick challenge / 3 questions</p><h3>Read the network.</h3><p>Test your instincts. Every answer has an explanation.</p></div><div class="quiz-panel"><span class="mini-label" id="quiz-count"></span><h4 id="quiz-question"></h4><div id="quiz-answers"></div><p id="quiz-feedback" aria-live="polite"></p><button class="btn g" id="quiz-next" hidden>Next question →</button></div>';
  lab.append(quiz);
  const questions=[{q:'Which protocol translates a domain name into an IP address?',a:['DNS','ARP','ICMP'],correct:0,why:'DNS resolves names. ARP maps local IPv4 addresses to MAC addresses; ICMP carries network control messages.'},{q:'What comes immediately after SYN in a successful TCP handshake?',a:['FIN','SYN / ACK','HTTP 200'],correct:1,why:'The server replies with SYN/ACK, then the client sends ACK to complete the handshake.'},{q:'Which tool is designed to inspect captured network packets?',a:['Hashcat','Gobuster','Wireshark'],correct:2,why:'Wireshark decodes captured packets, letting you inspect protocol fields and follow conversations.'}];
  let question=0,score=0,answered=false;
  function renderQuiz(){answered=false;const item=questions[question];q('#quiz-count').textContent=`QUESTION 0${question+1} / 03`;q('#quiz-question').textContent=item.q;q('#quiz-feedback').textContent='';q('#quiz-next').hidden=true;q('#quiz-answers').replaceChildren();item.a.forEach((answer,i)=>{const b=el('button','quiz-answer',answer);b.type='button';b.onclick=()=>{if(answered)return;answered=true;const good=i===item.correct;if(good)score++;[...q('#quiz-answers').children].forEach((button,j)=>{button.disabled=true;button.classList.toggle('correct',j===item.correct);button.classList.toggle('incorrect',j===i&&!good);});q('#quiz-feedback').textContent=(good?'Correct. ':'Not quite. ')+item.why;q('#quiz-next').hidden=false;q('#quiz-next').textContent=question===questions.length-1?`Score: ${score}/3 · Try again ↻`:'Next question →';};q('#quiz-answers').append(b);});}
  q('#quiz-next').onclick=()=>{question++;if(question===questions.length){question=0;score=0;}renderQuiz();};renderQuiz();

  const filters=el('div','journey-filters');filters.setAttribute('role','group');filters.setAttribute('aria-label','Filter learning roadmap');
  [['All milestones','all'],['Completed','done'],['In progress','now'],['Next goals','next']].forEach(([label,value])=>{const b=el('button','control',label);b.type='button';b.setAttribute('aria-pressed',String(value==='all'));b.onclick=()=>{filters.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));document.querySelectorAll('.road li').forEach(li=>{li.hidden=!(value==='all'||value==='done'&&li.classList.contains('d')||value==='now'&&li.classList.contains('n')||value==='next'&&!li.classList.contains('d')&&!li.classList.contains('n'));});};filters.append(b);});q('.road').before(filters);
  const shortcuts=el('div','console-shortcuts');['whoami','certs','tools','lab'].forEach(command=>{const b=el('button','control',command);b.type='button';b.onclick=()=>{ci.value=command;ci.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}));ci.focus();};shortcuts.append(b);});q('#ci').before(shortcuts);
  q('#con').setAttribute('aria-label','u2cxe — operator console');
  const consoleTitle=el('h3','console-title','u2cxe — operator console');q('#o').before(consoleTitle);
  sections.splice(3,0,['packet-lab','Interactive packet lab']);sections.find(x=>x[0]==='creds')[1]='CCNA and Pre Security credentials';
  C.packets=()=>{con.close();lab.scrollIntoView({behavior:calm?'instant':'smooth'});return '';};
  C.help=()=> 'whoami  certs  roadmap  links  open <site>  tools  theme  hack  lab  packets  search  clear';
  const labLink=el('a','','Packet lab ↗');labLink.href='#packet-lab';labLink.className='btn g';q('.hero .btns').append(labLink);
  const top=el('button','back-top','↑');top.type='button';top.setAttribute('aria-label','Back to top');top.onclick=()=>window.scrollTo({top:0,behavior:calm?'instant':'smooth'});B.append(top);const showTop=()=>top.hidden=scrollY<600;addEventListener('scroll',showTop,{passive:true});showTop();
  // Reveal new content and preserve cursor handling inside modal top layers.
  [identity,lab.querySelector('.lab-heading'),lab.querySelector('.lab-shell'),quiz].forEach(n=>{n.classList.add('rv');io.observe(n);});
  const li=el('li'),a=el('a','','packet lab');a.href='#packet-lab';li.append(a);q('#rail').children[1].after(li);so.observe(lab);
  document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target!==d)return;const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}));
})();
