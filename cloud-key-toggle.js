const cloudKeyInput=document.querySelector('#cloud-key');
const cloudKeyToggle=document.querySelector('#cloud-key-toggle');
const cloudKeyEye='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>';
const cloudKeyEyeOff='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.2A10.7 10.7 0 0 1 12 5c6.4 0 10 7 10 7a17.4 17.4 0 0 1-3 3.8M6.2 6.2C3.5 8 2 12 2 12s3.6 7 10 7a10.8 10.8 0 0 0 4-.8"/></svg>';
cloudKeyToggle.addEventListener('click',()=>{
  const visible=cloudKeyInput.type==='password';
  cloudKeyInput.type=visible?'text':'password';
  cloudKeyToggle.setAttribute('aria-label',visible?'Ocultar chave pública':'Mostrar chave pública');
  cloudKeyToggle.setAttribute('aria-pressed',String(visible));
  cloudKeyToggle.innerHTML=visible?cloudKeyEyeOff:cloudKeyEye;
});
