const profileAuthForm=document.querySelector('#profile-auth-form');
const profileEmail=document.querySelector('#profile-email');
const profilePassword=document.querySelector('#profile-password');
function authenticateFromProfile(mode){
  if(!profileAuthForm.reportValidity())return;
  const profile={name:document.querySelector('#profile-name').value.trim(),genres:[...document.querySelectorAll('#profile-form input[name="genre"]:checked')].map(input=>input.value)};
  localStorage.setItem('filmes-perfil',JSON.stringify(profile));
  markCloudDirty();
  document.querySelector('#profile-saved').textContent='Perfil salvo neste aparelho; sincronizando com a conta…';
  document.querySelector('#profile-avatar').textContent=(profile.name||'Filmes').charAt(0).toLocaleUpperCase('pt-BR');
  cloudAuth(mode,{email:profileEmail.value.trim(),password:profilePassword.value,autoSync:true});
}
document.querySelector('#profile-signin').addEventListener('click',()=>authenticateFromProfile('signin'));
document.querySelector('#profile-signup').addEventListener('click',()=>authenticateFromProfile('signup'));
profileAuthForm.addEventListener('submit',event=>{event.preventDefault();authenticateFromProfile('signin')});
document.querySelector('#profile-sync').addEventListener('click',()=>syncCloudData());
document.querySelector('#profile-cloud-setup').addEventListener('click',()=>openCloud());
const savedCloudConfig=readCloudConfig();
if(savedCloudConfig.key&&window.supabase?.createClient){
  const profileCloudClient=window.supabase.createClient(savedCloudConfig.url,savedCloudConfig.key);
  profileCloudClient.auth.getSession().then(({data})=>{
    if(data.session)cloudMessage(`Conectado como ${data.session.user.email}. Entre com esta mesma conta nos outros aparelhos.`);
  });
}

