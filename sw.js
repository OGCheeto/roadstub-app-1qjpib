/* Roadstub service worker: network-first for the app shell so updates show right away,
   with a cached copy for offline use. It never touches localStorage (your data). */
var CACHE='roadstub-buyer-v2'; /* own prefix: never touches other Roadstub caches on the same origin */
var SHELL=['./','./index.html','./manifest.webmanifest','./icons/logo.svg','./icons/favicon-32.png','./icons/favicon-64.png','./icons/apple-touch-icon.png','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(SHELL);}).then(function(){return self.skipWaiting();}));});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k.indexOf('roadstub-buyer-')===0&&k!==CACHE;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener('fetch',function(e){
  var req=e.request;if(req.method!=='GET'||new URL(req.url).origin!==location.origin)return;
  e.respondWith(fetch(req).then(function(res){if(res&&res.ok){var cp=res.clone();caches.open(CACHE).then(function(c){c.put(req,cp);});}return res;})
    .catch(function(){return caches.match(req,{ignoreSearch:true}).then(function(r){return r||(req.mode==='navigate'?caches.match('./index.html'):undefined);});}));
});
