var dataCacheName ='WeatherData'
var cacheName= 'Weather-PWA3.4';
var filesToCache = [
    '/',
    '/index.html',
    '/index.html?hs=true',
    '/scripts/app.js', 
    '/scripts/localforage.min.js', 
    '/styles/ud811.css', 
    '/images/clear.png',
    '/images/cloudy_s_sunny.png',
    '/images/cloudy-scattered-showers.png',
    '/images/cloudy.png',
    '/images/fog.png',
    '/images/ic_add_white_24px.svg',
    '/images/ic_refresh_white_24px.svg',
    '/images/partly-cloudy.png',
    '/images/rain.png',
    '/images/scattered-showers.png',
    '/images/sleet.png',
    '/images/snow.png',
    '/images/thunderstorm.png',
    '/images/wind.png']

self.addEventListener('install', function(e){
    self.skipWaiting()
    console.log('[serviceWorker] install')
    e.waitUntil(
        caches.open(cacheName).then(function(cache){
            console.log('[serviceWorker] caching appshell')
            return cache.addAll(filesToCache)
        })
    )
})

self.addEventListener('activation', function(e){
    console.log('[serviceWorker] activate')
    e.waitUntil(
        caches.keys().then(function(keysList){
           return Promise.all(keysList.map(function(key){
                if(key !== cacheName && key !== dataCacheName){
                    console.log('serviceWorker removing old cache', key)
                    caches.delete(key)
                }
            }))
        })
    )
})

self.addEventListener('fetch', function(e){
    console.log('[serviceWorker]fetch', e.request.url)
    var dataUrl = 'https://publicdata-weather.firebaseio.com/'
    if( e.request.url.startsWith(dataUrl)){
        fetch(e.request).then(function(response){
            return caches.open(dataCacheName).then(function(cache){
                cache.put(e.request.url, response.clone())
                console.log('[serviceWorker] fetched and cached data')
                return response
            })
        })
    }else{
        e.respondWith(
            caches.match(e.request).then(function(response){
                return response || fetch(e.request)
            })
        )
    }
  
})