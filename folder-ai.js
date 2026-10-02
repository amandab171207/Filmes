const folderAiForm=document.querySelector('#folder-ai-form');
const folderAiPrompt=document.querySelector('#folder-ai-prompt');
const folderAiStatus=document.querySelector('#folder-ai-status');
function normalizeFolderPrompt(value){return value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR').trim()}
function suggestFolderNameFromPrompt(prompt){
  const text=normalizeFolderPrompt(prompt);
  const media=text.includes('dorama')?'Doramas':text.includes('novela')?'Novelas':text.includes('anime')?'Animes':/\bserie(s)?\b/.test(text)?'Séries':/\bfilme(s)?\b/.test(text)?'Filmes':'';
  const genre=[['ficcao cientifica|ciencia ficcao|sci[ -]?fi','Ficção Científica'],['acao|aventura','Ação'],['comedia|engracad','Comédia'],['terror|assustador|horror','Terror'],['romance|romantico|romantica','Romance'],['classico','Clássicos']].find(([pattern])=>new RegExp(pattern).test(text))?.[1]||'';
  if(/familia|familiares/.test(text))return 'Para ver com a família';
  if(/fim de semana|final de semana|maratona/.test(text))return media?`Maratona de ${media.toLocaleLowerCase('pt-BR')}`:'Maratona de fim de semana';
  if(/assistir|ver depois|mais tarde|watchlist|quero ver/.test(text)){if(media&&genre)return `${media} de ${genre} para assistir`;if(media)return `${media} para assistir`;if(genre)return `Títulos de ${genre} para assistir`;return 'Quero assistir'}
  if(/ja assisti|assistidos|vistos|que vi/.test(text)){if(media&&genre)return `${media} de ${genre} que já assisti`;if(media)return `${media} que já assisti`;if(genre)return `Títulos de ${genre} que já assisti`;return 'Já assisti'}
  if(/favorit|preferid/.test(text)){if(media&&genre)return `${media} de ${genre} favoritos`;if(media)return `${media} favoritos`;if(genre)return `Favoritos de ${genre}`;return 'Meus favoritos'}
  if(media&&genre)return `${media} de ${genre}`;
  if(media)return media;
  if(genre)return `Títulos de ${genre}`;
  const cleaned=prompt.replace(/^(crie|criar|monte|montar|quero|uma pasta para|uma pasta de|organize|organizar)\s+/i,'').trim().replace(/[.!?]+$/,'');
  return cleaned?cleaned.charAt(0).toLocaleUpperCase('pt-BR')+cleaned.slice(1):'Minha coleção';
}
function createSuggestedFolder(prompt){
  const base=suggestFolderNameFromPrompt(prompt).slice(0,40).trim();
  let name=base, suffix=2;
  let existing=[];try{existing=JSON.parse(localStorage.getItem('filmes-pastas')||'[]').map(folder=>normalizeFolderPrompt(folder.name))}catch{}
  while(existing.includes(normalizeFolderPrompt(name))){const ending=` (${suffix++})`;name=base.slice(0,40-ending.length)+ending}
  const nameInput=document.querySelector('#folder-name');
  nameInput.value=name;
  document.querySelector('#folder-form').requestSubmit();
  folderAiStatus.textContent=`Pasta “${name}” criada e pronta para receber títulos.`;
  folderAiPrompt.value='';
}
folderAiForm.addEventListener('submit',event=>{event.preventDefault();if(!folderAiForm.reportValidity())return;createSuggestedFolder(folderAiPrompt.value.trim())});

