const mainCache = "restaurant-reviews-v1";

self.addEventListener('install', (evt) => {
    //installation will finish only after all files are cached
    evt.waitUntil(
        caches.open(mainCache).then((cache) => {
            //store a reference of cache in currentCache property
            //to use it later to add content to cache
            self.currentCache = cache;
            //add to cache the basic files of the page
            return cache.addAll([
                'index.html',
                'restaurant.html',
                'css/styles.css',
                'css/styles-rest.css',
                'css/media.css',
                'css/media-rest.css',
                'js/dbhelper.js',
                'js/main.js',
                'js/restaurant_info.js',
                'data/restaurants.json',
                'img/1.jpg',
                'img/2.jpg',
                'img/3.jpg',
                'img/4.jpg',
                'img/5.jpg',
                'img/6.jpg',
                'img/7.jpg',
                'img/8.jpg',
                'img/9.jpg',
                'img/rest.jpg'
            ]);
        }).catch((err) => {
            console.log("error in load files in cache", err);
        })
    );
});

//fetch files from cache or network
self.addEventListener('fetch', (evt) => {

    evt.respondWith(
        //check first if requested files are already in cache
        caches.match(evt.request).then((response) => {

            if (response) {
                //if files are find in cache return
                return response;
            } else {
                //if files are not found in cache request them from the network
                return fetch(evt.request).then((response) => {
                    return response;
                }).catch((err) => {
                    console.log('Fetching failed', err);
                });
            }
        })
    );

    //save to cache files that were not placed there during service worker installation
    //this is mainly for map files. When user visits a restaurant page, images of the map
    //are stored in cache memory. When user uses the app offline will now have access to 
    //map images for restaurant pages he visited in the past using network connection.
    caches.match(evt.request).then((response) => {
        if (!response) {
            //if response is not found in cache get if again from network and save it in cache
            fetch(evt.request).then((response) => {
                //do this by using the reference to current cache property
                self.currentCache.put(evt.request, response);
            });
        }
    });

});