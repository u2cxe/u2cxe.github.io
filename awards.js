/* Academic award supplied by Abdulrahman. The original certificate photo is preserved. */
(() => {
  const dialog=document.querySelector('#academic-award-dialog');
  document.querySelectorAll('[data-open-academic-award]').forEach(button=>button.addEventListener('click',()=>dialog.showModal()));
  document.querySelector('#close-academic-award').addEventListener('click',()=>dialog.close());
  const entry=sections.find(s=>s[0]==='achievements');
  if(entry)entry[1]='Achievements & Awards — academic excellence and TryHackMe';
  C.awards=()=> 'Academic Excellence Award\nAl-Ahliyya Amman University / Faculty of Information Technology\nNetworks & Cybersecurity\nGPA: 4.0 / 4.0\nAcademic year: 2024/2025\nOriginal certificate available in Achievements & Awards.';
  const previousHelp=C.help;C.help=()=>previousHelp()+'  awards';
  const shortcut=document.createElement('button');shortcut.type='button';shortcut.className='control';shortcut.textContent='awards';shortcut.onclick=()=>{ci.value='awards';ci.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}));ci.focus();};document.querySelector('.console-shortcuts').append(shortcut);
  const gpa=document.querySelector('#recon [data-n="4.0"]');
  if(gpa){const link=document.createElement('a');link.href='#academic-award';link.className='award-jump';link.textContent='View academic award ↗';gpa.parentElement.append(link);}
})();
