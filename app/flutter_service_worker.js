'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"canvaskit/canvaskit.js": "c86fbd9e7b17accae76e5ad116583dc4",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03",
"canvaskit/skwasm.js.symbols": "741d50ffba71f89345996b0aa8426af8",
"canvaskit/canvaskit.wasm": "3d2a2d663e8c5111ac61a46367f751ac",
"canvaskit/chromium/canvaskit.js": "43787ac5098c648979c27c13c6f804c3",
"canvaskit/chromium/canvaskit.wasm": "f5934e694f12929ed56a671617acd254",
"canvaskit/chromium/canvaskit.js.symbols": "4525682ef039faeb11f24f37436dca06",
"canvaskit/skwasm.js": "445e9e400085faead4493be2224d95aa",
"canvaskit/skwasm.wasm": "e42815763c5d05bba43f9d0337fa7d84",
"canvaskit/canvaskit.js.symbols": "38cba9233b92472a36ff011dc21c2c9f",
"favicon.svg": "b17f73d78c6e5ffa8286568c06ef5733",
"manifest.json": "87d33c9d82861cfe002b90d23d7663bc",
"flutter.js": "c71a09214cb6f5f8996a531350400a9a",
"index.html": "fa5bdfe7a293e9d9143e5a009a24ac74",
"/": "fa5bdfe7a293e9d9143e5a009a24ac74",
"assets/FontManifest.json": "e6fa79dba89f9366166261f34a1d8cff",
"assets/AssetManifest.bin": "becff081f81f4baa9f1d01dff0aa7f35",
"assets/assets/sound/bead-16.wav": "aa0b610865bc9e1771410ae7b2464ad5",
"assets/assets/sound/bead-12.wav": "adb5a0532d7d4ef71096b04c52c98053",
"assets/assets/sound/bead-7.wav": "e9658d0d5e56db54bd4a0a36cde27875",
"assets/assets/sound/bead-6.wav": "74ea82f3fa477eff236e3d16ea91db35",
"assets/assets/sound/bead-3.wav": "a4c519330d1e025ab7629114f104fda6",
"assets/assets/sound/bead-1.wav": "129eb0c178d472e7b449f6f3bbd820d8",
"assets/assets/sound/bead-2.wav": "a7962b6ff7abb317f093d594ddbbe4f6",
"assets/assets/sound/bead-13.wav": "3935b3961ec90777ba8c9c6dfd2eccc0",
"assets/assets/sound/bead-4.wav": "802bed30f27fd927d390604588b92a3c",
"assets/assets/sound/bead-9.wav": "650dc736c0c52185b4f342328abe1e85",
"assets/assets/sound/bead-11.wav": "e53df24b66463b7972266ded6b6631d0",
"assets/assets/sound/bead-15.wav": "e9fe979db2b7465222ffec72818f0e24",
"assets/assets/sound/bead-8.wav": "37639e9df5f587aab2b5504e72767678",
"assets/assets/sound/bead-0.wav": "f18fb122ae5bee3df712a119d9199a31",
"assets/assets/sound/bead-5.wav": "7fc9bb9e58c205c77955f61c1e4d2385",
"assets/assets/sound/bead-14.wav": "cd0e06c886fe3d78f9068382d27a2db2",
"assets/assets/sound/bead-10.wav": "d1edf3a6487ee2d9520ff2b6ada52ba9",
"assets/assets/fonts/Montserrat/static/Montserrat-Regular.ttf": "5e077c15f6e1d334dd4e9be62b28ac75",
"assets/assets/fonts/Montserrat/static/Montserrat-Italic.ttf": "cc53ad8bb1c801746c831bb7ce493f74",
"assets/assets/fonts/CourierPrimeSans/CourierPrimeSans.ttf": "76f1c070153b1063a0013689aa86b2aa",
"assets/assets/fonts/CourierPrimeSans/CourierPrimeSansBold.ttf": "cdd5cd77b7ffe5dcdf79957630ea5d90",
"assets/assets/fonts/Gaegu/Gaegu-Bold.ttf": "33aed714c4f905218f66be72588b34f1",
"assets/AssetManifest.bin.json": "258eb69159da91e61525759f02d87e9a",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/NOTICES": "2175a248e9ad830058a4bf99599c6f65",
"assets/fonts/MaterialIcons-Regular.otf": "85a033c00b76361833c67a11a2164828",
"assets/AssetManifest.json": "c1d1285d3bbda5357a66254ec11a0034",
"main.dart.js": "ff0f2e8b5bcc1937717d7abdaafb8f3a",
"app_icon_256.png": "a3b7722c8b84a2a188a8c3ea1a47c925",
"version.json": "4163062ad84296b78fb51d06d71424a6"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
