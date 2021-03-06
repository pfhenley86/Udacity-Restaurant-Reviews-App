/**
 * Common database helper functions.
 */
class DBHelper {
  // Create new class to register service worker
  static registerServiceWorker() {
      //check if browser supports service workers, if not return.
      if (!navigator.serviceWorker) return;
      //Register service worker after DOM content has loaded
      window.addEventListener('load', function() {
          /***** Switch comments in code to run page on local servel OR on github *****/
          // navigator.serviceWorker.register('/sw.js', {
          //     scope: '/'
          navigator.serviceWorker.register('./sw.js', {
              scope: '/'
          }).then(function(reg) {
              console.log("Service Worker Registered with scope: ", reg.scope);
          }).catch(function(err) {
              console.log("Error in Service Worker Registration: ", err);
          });
      });
  }


  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
      const port = 8000 // Change this to your server port
      /***** Switch comments in code to run page on local servel OR on github *****/
      // return `http://localhost:${port}/data/restaurants.json`;
      return `https://anastasiaevgenia.github.io/restaurant-reviews-app-stage-1/data/restaurants.json`;
  }

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {
      let xhr = new XMLHttpRequest();
      xhr.open('GET', DBHelper.DATABASE_URL);
      xhr.onload = () => {
          if (xhr.status === 200) { // Got a success response from server!
              const json = JSON.parse(xhr.responseText);
              const restaurants = json.restaurants;
              callback(null, restaurants);
          } else { // Oops!. Got an error from server.
              const error = (`Request failed. Returned status of ${xhr.status}`);
              callback(error, null);
          }
      };
      xhr.send();
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
      // fetch all restaurants with proper error handling.
      DBHelper.fetchRestaurants((error, restaurants) => {
          if (error) {
              callback(error, null);
          } else {
              const restaurant = restaurants.find(r => r.id == id);
              if (restaurant) { // Got the restaurant
                  callback(null, restaurant);
              } else { // Restaurant does not exist in the database
                  callback('Restaurant does not exist', null);
              }
          }
      });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
      // Fetch all restaurants  with proper error handling
      DBHelper.fetchRestaurants((error, restaurants) => {
          if (error) {
              callback(error, null);
          } else {
              // Filter restaurants to have only given cuisine type
              const results = restaurants.filter(r => r.cuisine_type == cuisine);
              callback(null, results);
          }
      });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
      // Fetch all restaurants
      DBHelper.fetchRestaurants((error, restaurants) => {
          if (error) {
              callback(error, null);
          } else {
              // Filter restaurants to have only given neighborhood
              const results = restaurants.filter(r => r.neighborhood == neighborhood);
              callback(null, results);
          }
      });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
      // Fetch all restaurants
      DBHelper.fetchRestaurants((error, restaurants) => {
          if (error) {
              callback(error, null);
          } else {
              let results = restaurants
              if (cuisine != 'all') { // filter by cuisine
                  results = results.filter(r => r.cuisine_type == cuisine);
              }
              if (neighborhood != 'all') { // filter by neighborhood
                  results = results.filter(r => r.neighborhood == neighborhood);
              }
              callback(null, results);
          }
      });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
      // Fetch all restaurants
      DBHelper.fetchRestaurants((error, restaurants) => {
          if (error) {
              callback(error, null);
          } else {
              // Get all neighborhoods from all restaurants
              const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
              // Remove duplicates from neighborhoods
              const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
              callback(null, uniqueNeighborhoods);
          }
      });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
      // Fetch all restaurants
      DBHelper.fetchRestaurants((error, restaurants) => {
          if (error) {
              callback(error, null);
          } else {
              // Get all cuisines from all restaurants
              const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
              // Remove duplicates from cuisines
              const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
              callback(null, uniqueCuisines);
          }
      });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
      return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
      /***** Switch comments in code to run page on local servel OR on github *****/
      // return (`/img/${restaurant.photograph}`);
      return (`./img/${restaurant.photograph}`);
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
      // https://leafletjs.com/reference-1.3.0.html#marker  
      const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng], {
          title: restaurant.name,
          alt: restaurant.name,
          url: DBHelper.urlForRestaurant(restaurant)
      })
      marker.addTo(newMap);
      return marker;
  }
  /* static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  } */

}