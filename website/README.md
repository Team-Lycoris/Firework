# Firework.Website

Obtain API key:
1. Go to this link to the Google Maps Platform Credentials page `https://console.cloud.google.com/projectselector2/google/maps-apis/credentials?utm_source=Docs_CreateAPIKey&utm_content=Docs_maps-backend&_gl=1*17wnwbm*_ga*NjMwNzY5OTQuMTcwODkxMDgwNg..*_ga_NRWSTWS78N*MTcxMDM5MTUwNy4xNS4xLjE3MTAzOTE1MDkuMC4wLjA.`
2. Click Create credentials > API key.
3. The API Key will be on the Credentials page under API keys.
4. Note that acquiring a key requires making a cloud account and linking a payment method, however the payment method will not be used unless the "free use limit" of the key is exceeded.
5. For help, navigate to `https://developers.google.com/maps/documentation/javascript/get-api-key`

Setup:
1. Open up a terminal and navigate into the website directory.
2. Run `npm install`
3. Run `npm start`
4. At this point, the website should automatically open in a web browser.

Notes:
1. You can test with more users by opening new browsers (or browser profiles, or incognito windows) and navigating to `http://localhost:3000`
2. Location sharing may not work if your browser or system doesn't support geolocation.
3. It may not be possible to enable notifications at all depending on your browser. See https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API.
