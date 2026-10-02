const CACHE_NAME='filmes-app-v7';
const APP_FILES=['./','./index.html','./style.css','./app.js','./manifest.webmanifest','./icons/icon.svg'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET'||new URL(request.url).origin!==self.location.origin)return;
  const path=new URL(request.url).pathname;
  const appShell=request.mode==='navigate'||/\/(index\.html|style\.css|app\.js|sw\.js)$/.test(path);
  event.respondWith((async()=>{
    if(appShell){
      try{
        const fresh=await fetch(request,{cache:'no-store'});
        if(fresh.ok)caches.open(CACHE_NAME).then(cache=>cache.put(request,fresh.clone()));
        return fresh;
      }catch{return (await caches.match(request))||caches.match('./index.html');}
    }
    const cached=await caches.match(request);
    if(cached)return cached;
    try{
      const fresh=await fetch(request);
      if(fresh.ok)caches.open(CACHE_NAME).then(cache=>cache.put(request,fresh.clone()));
      return fresh;
    }catch{return caches.match('./index.html');}
  })());
});

