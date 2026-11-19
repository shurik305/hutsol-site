// Carry only the current campaign source to same-origin HTML links.
(function () {
  'use strict';
  var src = (new URLSearchParams(location.search).get('src') || '').slice(0, 40);
  if (!src) return;
  document.querySelectorAll('a[href]').forEach(function (link) {
    var url = new URL(link.getAttribute('href'), location.href);
    if (url.origin !== location.origin || !/\.html$/.test(url.pathname)) return;
    url.searchParams.set('src', src);
    link.setAttribute('href', url.pathname + url.search + url.hash);
  });
}());
