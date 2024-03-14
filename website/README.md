# Firework.Website

Public GitHub Link: https://github.com/Team-Lycoris/Firework

Setup:
1. Open up a terminal and navigate into the website directory.
2. Run `npm install`
3. Make a copy of `config.json.example` named `config.json`, and supply an API key to embed Google Maps. See https://developers.google.com/maps/documentation/javascript/get-api-key for how to obtain an API key. Alternatively, don't supply an API key and the website will instead redirect directly to Google Maps.
4. Run `npm start`
5. At this point, the website should automatically open in a web browser.

Notes:
1. You can test with more users by opening new browsers (or browser profiles, or incognito windows) and navigating to `http://localhost:3000`
2. Location sharing may not work if your browser or system doesn't support geolocation.
3. It may not be possible to enable notifications at all depending on your browser. See https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API.
