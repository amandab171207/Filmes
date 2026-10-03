const TMDB_API='https://api.themoviedb.org/3';
const allowedRoutes=new Set(['/search/multi','/discover/movie','/discover/tv']);
const allowedParams=['query','language','page','include_adult','include_video','sort_by','watch_region','with_watch_monetization_types','with_genres','with_origin_country','with_original_language','without_genres','region'];
export default {
  async fetch(request,env){
    const url=new URL(request.url);
    const path=url.pathname.replace(/\/+$/,'');
    const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET, OPTIONS','Access-Control-Allow-Headers':'Accept','Vary':'Origin'};
    if(request.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
    if(request.method!=='GET')return new Response('Method not allowed',{status:405,headers:cors});
    if(!allowedRoutes.has(path))return new Response('Not found',{status:404,headers:cors});
    if(!env.TMDB_READ_ACCESS_TOKEN)return new Response('TMDB proxy is not configured',{status:503,headers:cors});
    if(path==='/search/multi'){
      const query=(url.searchParams.get('query')||'').trim();
      if(query.length<2||query.length>120)return new Response('Invalid query',{status:400,headers:cors});
    }
    const page=Number(url.searchParams.get('page')||1);
    if(!Number.isInteger(page)||page<1||page>500)return new Response('Invalid page',{status:400,headers:cors});
    const upstream=new URL(`${TMDB_API}${path}`);
    for(const key of allowedParams){
      const value=url.searchParams.get(key);
      if(value)upstream.searchParams.set(key,value);
    }
    try{
      const response=await fetch(upstream,{headers:{Authorization:`Bearer ${env.TMDB_READ_ACCESS_TOKEN}`,Accept:'application/json'}});
      const headers=new Headers(cors);
      headers.set('Content-Type','application/json; charset=utf-8');
      headers.set('Cache-Control','public, max-age=300');
      return new Response(response.body,{status:response.status,headers});
    }catch{
      return new Response('TMDB is temporarily unavailable',{status:502,headers:cors});
    }
  }
};