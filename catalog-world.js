const TMDB_IMAGE_BASE='https://image.tmdb.org/t/p/w500';
const worldConfigKey='filmes-tmdb-proxy';
const catalogStatus=document.querySelector('#catalog-status');
const catalogGrid=document.querySelector('#movie-grid');
const catalogNav=document.querySelector('#pagination');
const catalogSearch=document.querySelector('#search');
const catalogBrowseButton=document.querySelector('#catalog-browse-br');
const localCatalogItems=[...movies];
let worldSearchTimer=null,worldRequest=0,worldItems=[],worldMode='local',worldPage=1,worldTotalPages=1,worldTotalResults=0;
const catalogAttribution='Dados de disponibilidade por TMDB, fonte JustWatch.';
function configuredCatalogEndpoint(){return(localStorage.getItem(worldConfigKey)||'').trim().replace(/\/$/,'')}
function guessWorldType(item){
  const origin=(item.origin_country||[]).map(code=>code.toUpperCase());
  const genres=item.genre_ids||[];
  if(item.media_type==='movie')return 'Filme';
  if(genres.includes(16)&&origin.includes('JP'))return 'Anime';
  if(origin.includes('KR')||origin.includes('JP'))return 'Dorama';
  if(genres.includes(10766))return 'Novela';
  return 'Série';
}
function fromWorldResult(item){
  const title=item.title||item.name||item.original_title||item.original_name;
  const year=(item.release_date||item.first_air_date||'').slice(0,4)||'—';
  const labels={28:'Ação',12:'Aventura',16:'Animes',18:'Drama',27:'Terror',35:'Comédia',53:'Suspense',80:'Crime',10749:'Romance',878:'Ficção Científica',14:'Fantasia',10766:'Novelas',10759:'Ação e aventura',10765:'Ficção científica e fantasia'};
  const categories=[...new Set((item.genre_ids||[]).map(id=>labels[id]).filter(Boolean))];
  const type=guessWorldType(item);
  if(type==='Anime'&&!categories.includes('Animes'))categories.unshift('Animes');
  if(type==='Série'&&!categories.includes('Séries'))categories.unshift('Séries');
  if(type==='Novela'&&!categories.includes('Novelas'))categories.unshift('Novelas');
  if(type==='Dorama'&&!categories.includes('Doramas'))categories.unshift('Doramas');
  return{id:`tmdb-${item.media_type}-${item.id}`,tmdbId:item.id,mediaType:item.media_type,title,year,type,categories:categories.length?categories:['Drama'],rating:item.vote_average?Number(item.vote_average).toFixed(1):'—',duration:item.media_type==='movie'?'Filme':'Série',poster:item.poster_path?`${TMDB_IMAGE_BASE}${item.poster_path}`:'https://placehold.co/500x750/202231/f3a75a?text=Sem+imagem',synopsis:item.overview||'Sinopse não disponível.',language:item.original_language||'—',worldCatalog:true};
}
function browseSourcesForType(type){
  if(type==='Filmes')return[{path:'/discover/movie',media:'movie'}];
  if(type==='Séries')return[{path:'/discover/tv',media:'tv'}];
  if(type==='Animes')return[{path:'/discover/tv',media:'tv',filters:{with_genres:'16',with_original_language:'ja'}},{path:'/discover/movie',media:'movie',filters:{with_genres:'16',with_original_language:'ja'}}];
  if(type==='Doramas')return[{path:'/discover/tv',media:'tv',filters:{with_origin_country:'KR|JP',without_genres:'16'}}];
  if(type==='Novelas')return[{path:'/discover/tv',media:'tv',filters:{with_genres:'10766'}}];
  return[{path:'/discover/movie',media:'movie'},{path:'/discover/tv',media:'tv'}];
}
async function fetchWorld(endpoint,path,params){
  const url=new URL(`${endpoint}${path}`);
  for(const[key,value]of Object.entries(params))url.searchParams.set(key,String(value));
  const response=await fetch(url,{headers:{Accept:'application/json'}});
  if(!response.ok)throw new Error(`HTTP ${response.status}`);
  return response.json();
}
function clearWorldItems(){movies.splice(0,movies.length,...localCatalogItems);worldItems=[]}
function drawWorldPagination(){
  const max=Math.max(1,worldTotalPages);
  worldPage=Math.min(Math.max(1,worldPage),max);
  catalogNav.innerHTML=`<button class="page-button" data-world-page="${worldPage-1}" ${worldPage===1?'disabled':''}>← Anterior</button><span class="page-total">Página ${worldPage} de ${max.toLocaleString('pt-BR')}</span><button class="page-button" data-world-page="${worldPage+1}" ${worldPage===max?'disabled':''}>Próxima →</button>`;
  const visible=catalogGrid.querySelectorAll('.movie-card').length;
  document.querySelector('#result-count').textContent=`${visible} títulos nesta página · ${worldTotalResults.toLocaleString('pt-BR')} resultado(s) no catálogo do Brasil. ${catalogAttribution}`;
}
async function loadWorldPage(page){
  const endpoint=configuredCatalogEndpoint();
  if(!endpoint){catalogStatus.textContent='Para carregar o catálogo do Brasil, configure primeiro a URL HTTPS do proxy TMDB.';return;}
  const request=++worldRequest;
  worldPage=Math.max(1,Math.min(Number(page)||1,500));
  catalogStatus.textContent=worldMode==='search'?'Buscando títulos…':'Carregando títulos disponíveis no Brasil…';
  try{
    let results=[],totalPages=1,totalResults=0,perApiPage=20;
    if(worldMode==='search'){
      const payload=await fetchWorld(endpoint,'/search/multi',{query:query.trim(),language:'pt-BR',page:worldPage,include_adult:'false'});
      if(request!==worldRequest)return;
      results=(payload.results||[]).filter(item=>item.media_type==='movie'||item.media_type==='tv');
      totalPages=Math.min(500,Number(payload.total_pages)||1);totalResults=Number(payload.total_results)||results.length;
    }else{
      const sources=browseSourcesForType(typeFilter);
      perApiPage=20*sources.length;
      const payloads=await Promise.all(sources.map(source=>fetchWorld(endpoint,source.path,{language:'pt-BR',page:worldPage,region:'BR',watch_region:'BR',with_watch_monetization_types:'flatrate|free|ads|rent|buy',sort_by:'popularity.desc',include_adult:'false',include_video:'false',...source.filters})));
      if(request!==worldRequest)return;
      results=payloads.flatMap((payload,index)=>(payload.results||[]).map(item=>({...item,media_type:sources[index].media})));
      totalPages=Math.min(500,Math.max(...payloads.map(payload=>Number(payload.total_pages)||1)));
      totalResults=payloads.reduce((sum,payload)=>sum+(Number(payload.total_results)||0),0);
    }
    worldItems=results.map(fromWorldResult).filter(item=>item.title);
    movies.splice(0,movies.length,...worldItems);
    pageSize=perApiPage;
    catalogPage=1;
    worldTotalPages=totalPages;worldTotalResults=totalResults;
    render();
    drawWorldPagination();
    catalogStatus.textContent=worldMode==='search'?`Resultados da busca mundial · página ${worldPage} de ${worldTotalPages}.`:`Disponibilidade no Brasil · página ${worldPage} de ${worldTotalPages}.`;
  }catch(error){
    if(request!==worldRequest)return;
    catalogStatus.textContent='Não foi possível consultar o catálogo agora. Confira a URL do proxy TMDB e tente novamente.';
    console.error('Erro ao consultar catálogo TMDB:',error);
  }
}
function useLocalCatalog(message='Catálogo local de exemplos. Configure uma fonte para explorar disponibilidade no Brasil.'){
  worldMode='local';++worldRequest;clearTimeout(worldSearchTimer);clearWorldItems();pageSize=8;catalogPage=1;render();catalogStatus.textContent=message;
}
catalogBrowseButton.addEventListener('click',()=>{
  if(query){query='';catalogSearch.value='';}
  typeFilter='Todos';activeCategory='Todos';favoritesOnly=false;watchedOnly=false;folderFilter=null;catalogPage=1;worldMode='browse';render();loadWorldPage(1);
});
document.querySelector('#catalog-source-config').addEventListener('click',()=>{
  const current=configuredCatalogEndpoint();
  const value=prompt('Cole a URL HTTPS base do Cloudflare Worker com a API TMDB configurada. Nunca cole a chave secreta aqui.',current);
  if(value===null)return;
  const endpoint=value.trim().replace(/\/$/,'');
  if(endpoint&&(!/^https:\/\//i.test(endpoint)||endpoint.includes('api.themoviedb.org'))){alert('Informe a URL HTTPS do seu proxy, não a URL direta do TMDB.');return;}
  if(endpoint)localStorage.setItem(worldConfigKey,endpoint);else localStorage.removeItem(worldConfigKey);
  if(endpoint){catalogStatus.textContent='Fonte salva neste dispositivo.';if(worldMode!=='local')loadWorldPage(1);}
  else useLocalCatalog('Fonte removida; mostrando os exemplos locais.');
});
catalogNav.addEventListener('click',event=>{
  const button=event.target.closest('[data-world-page]');
  if(button&&!button.disabled)loadWorldPage(Number(button.dataset.worldPage));
});
new MutationObserver(()=>{if(worldMode!=='local'&&!catalogNav.querySelector('[data-world-page]'))drawWorldPagination()}).observe(catalogNav,{childList:true});
document.querySelector('#type-pages').addEventListener('click',()=>{
  if(worldMode==='browse'||(worldMode==='search'&&query.trim().length>=2))loadWorldPage(1);
});
document.querySelector('#clear-filters').addEventListener('click',()=>{
  if(worldMode==='search')useLocalCatalog(configuredCatalogEndpoint()?'Busca limpa; exemplos locais exibidos.':'Catálogo local de exemplos. Configure uma fonte para explorar disponibilidade no Brasil.');
});
catalogSearch.addEventListener('input',()=>{
  clearTimeout(worldSearchTimer);++worldRequest;
  const value=catalogSearch.value.trim();
  if(value.length>=2){worldMode='search';worldSearchTimer=setTimeout(()=>loadWorldPage(1),350);return;}
  if(worldMode==='search')useLocalCatalog(configuredCatalogEndpoint()?'Digite pelo menos 2 letras para pesquisar no catálogo mundial.':'Catálogo local de exemplos. Configure uma fonte para explorar disponibilidade no Brasil.');
  else if(worldMode==='browse')loadWorldPage(1);
});
if(configuredCatalogEndpoint()){
  worldMode='browse';
  loadWorldPage(1);
}