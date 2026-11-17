/* Portfolio CLI: commands display local profile content, never execute system commands. */
(() => {
 const input=document.querySelector('#hero-command'),output=document.querySelector('#hero-output'),form=document.querySelector('#hero-cli-form');
 const history=[];let position=0;
 const commands={
  help:()=> 'whoami                 Meet Abdulrahman\npwd                    Current profile directory\nls                     List profile files\ncat focus.txt          Red team focus\ncat about.txt          Education and background\nskills                 Explore my toolkit\ncerts                  Certificates and learning paths\nstats                  TryHackMe progress\nawards                 Academic recognition\ncontact                Social profiles and website\nlab                    Open the network simulation\npackets                Open the packet explorer\ntheme                  Switch red / ice theme\nclear                  Clear this terminal',
  whoami:()=> 'Abdulrahman Ghanayem\n@u2cxe · Networks & Cybersecurity\nRed Team · Penetration Tester · Network Pentester',
  pwd:()=> '/home/u2cxe',
  ls:()=> 'about.txt    focus.txt    skills/\ncertificates/    achievements/    labs/    contact.txt',
  cat:args=>({
   'focus.txt':'Red Team · Penetration Tester · Network Pentester',
   'about.txt':'Abdulrahman Ghanayem (@u2cxe)\nNetworks & Cybersecurity student\nAl-Ahliyya Amman University · Jordan\nAcademic excellence: 4.0 / 4.0 · 2024/2025',
   'contact.txt':'Website    https://u2cxe.me\nGitHub     https://github.com/u2cxe\nTryHackMe  https://tryhackme.com/p/u2cxe\nLinkedIn   https://www.linkedin.com/in/abdulrahman-ghanayem-6a95833b1/'
  }[args]||'File not found. Try: cat focus.txt, cat about.txt or cat contact.txt'),
  skills:()=>Object.entries(T).map(([name,details])=>name+' — '+details[0]+(['Nmap','Wireshark'].includes(name)?' [completed · proficient]':' [learning]')).join('\n'),
  certs:()=>C.certs(),stats:()=>C.stats(),awards:()=>C.awards(),contact:()=>commands.cat('contact.txt'),
  lab:()=>{document.querySelector('#network-lab').scrollIntoView({behavior:calm?'instant':'smooth'});return 'Opening the local network simulation…';},
  packets:()=>{document.querySelector('#packet-lab').scrollIntoView({behavior:calm?'instant':'smooth'});return 'Opening the packet explorer…';},
  theme:()=>C.theme(),clear:()=>{output.replaceChildren();return '';}
 };
 function print(text,className='cli-result'){const node=document.createElement('div');node.className=className;node.textContent=text;output.append(node);while(output.children.length>50)output.firstElementChild.remove();output.scrollTop=output.scrollHeight;}
 function run(value){const raw=value.trim();if(!raw)return;history.push(raw);position=history.length;print('u2cxe@portfolio:~$ '+raw,'cli-echo');const [name,...args]=raw.split(/\s+/);const key=name.toLowerCase();if(!Object.hasOwn(commands,key)){print('Command not found: '+name+'\nType help or choose a command below.','cli-result cli-error');return;}const answer=commands[key](args.join(' '));if(answer){if(key==='whoami'){const lines=answer.split('\n');print(lines.shift(),'cli-name');print(lines.join('\n'));}else print(answer);} }
 form.addEventListener('submit',e=>{e.preventDefault();const value=input.value;input.value='';run(value);});
 const suggestions=['whoami','pwd','ls','cat focus.txt','skills','certs','stats','awards','contact','help','clear'];
 suggestions.forEach(command=>{const b=document.createElement('button');b.type='button';b.className='cli-suggestion';b.textContent=command;b.onclick=()=>{input.value='';run(command);if(matchMedia('(pointer:fine)').matches)input.focus({preventScroll:true});};document.querySelector('#hero-cli-suggestions').append(b);});
 input.addEventListener('keydown',e=>{if(e.key==='ArrowUp'){e.preventDefault();position=Math.max(0,position-1);input.value=history[position]||'';}else if(e.key==='ArrowDown'){e.preventDefault();position=Math.min(history.length,position+1);input.value=history[position]||'';}else if(e.key==='Tab'&&input.value.trim()){const matches=[...Object.keys(commands),'cat focus.txt','cat about.txt','cat contact.txt'].filter(c=>c.startsWith(input.value.trim()));if(matches.length===1){e.preventDefault();input.value=matches[0];}}});
 print('Welcome to u2cxe — operator console.\nType a command, or choose one below.','cli-welcome');run('whoami');
 const networkEntry=sections.find(x=>x[0]==='top');if(networkEntry)networkEntry[1]='Home and interactive CLI';sections.push(['network-lab','Network simulation']);
 C.hack=()=>{con.close();commands.lab();return '';};
})();
