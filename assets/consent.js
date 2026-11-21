/* Hutsol Service ApS - cookie consent + Google Ads conversion measurement.
 * Basic consent mode: NO Google script loads and NO cookie is set until the
 * visitor clicks "Accepter". Choice is stored in localStorage (strictly
 * necessary to remember the choice). Measurement only: ad personalisation
 * (remarketing) stays denied even after consent.
 * Datatilsynet/Digitaliseringsstyrelsen, "Brug af cookies og lignende teknologier", maj 2025.
 */
(function () {
  'use strict';
  var TAG_ID = 'AW-18571203454';
  var CONVERSIONS = {
    lead: 'AW-18571203454/qPTRCLbQ3rwdEP6muJdF',    // Forespørgsel sendt (hutsol.dk)
    booking: 'AW-18571203454/y0GHCLnQ3rwdEP6muJdF'  // Booking bekræftet (hutsol.dk)
  };
  var KEY = 'hutsol_consent';
  var MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000; // ask again after 12 months
  var loaded = false;

  function readChoice() {
    try {
      var raw = window.localStorage.getItem(KEY);
      if (!raw) return null;
      var c = JSON.parse(raw);
      if (!c || (c.choice !== 'granted' && c.choice !== 'denied')) return null;
      if (typeof c.ts !== 'number' || Date.now() - c.ts > MAX_AGE_MS) return null;
      return c.choice;
    } catch (e) { return null; }
  }

  function saveChoice(choice) {
    try { window.localStorage.setItem(KEY, JSON.stringify({ v: 1, choice: choice, ts: Date.now() })); } catch (e) {}
  }

  function loadGoogle() {
    if (loaded) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied'
    });
    window.gtag('consent', 'update', { ad_storage: 'granted', ad_user_data: 'granted' });
    window.gtag('js', new Date());
    window.gtag('config', TAG_ID, { allow_ad_personalization_signals: false });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + TAG_ID;
    document.head.appendChild(s);
  }

  function deleteGoogleCookies() {
    var host = window.location.hostname;
    var domains = ['', host, '.' + host, '.' + host.replace(/^www\./, '')];
    document.cookie.split(';').forEach(function (part) {
      var name = part.split('=')[0].trim();
      if (!/^(_gcl_|_gac_|FPGCL|FPGSID)/.test(name)) return;
      domains.forEach(function (d) {
        document.cookie = name + '=; Max-Age=0; path=/' + (d ? '; domain=' + d : '');
      });
    });
    [window.localStorage, window.sessionStorage].forEach(function (store) {
      try {
        Object.keys(store).forEach(function (k) { if (/^(_gcl_|_gac_)/.test(k)) store.removeItem(k); });
      } catch (e) {}
    });
  }

  // Public: fire a conversion. Does nothing without consent.
  window.hutsolTrack = function (name) {
    if (readChoice() !== 'granted' || !CONVERSIONS[name]) return false;
    loadGoogle();
    window.gtag('event', 'conversion', { send_to: CONVERSIONS[name] });
    return true;
  };

  var STYLE = '' +
    '#hc-banner{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:560px;margin:0 auto;' +
    'background:#fff;color:#1b2a3f;border:1px solid #c9d3df;border-radius:12px;box-shadow:0 8px 28px rgba(0,0,0,.18);' +
    'padding:18px 18px 16px;font:15px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif}' +
    '#hc-banner h2{font-size:17px;margin:0 0 8px}#hc-banner p{margin:0 0 10px}' +
    '#hc-banner a{color:#1f5fa6}' +
    '#hc-banner .hc-btns{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px}' +
    '#hc-banner button{flex:1 1 140px;min-height:44px;font-family:inherit;font-size:15px;font-weight:600;line-height:1.2;border-radius:8px;cursor:pointer;' +
    'background:#1b2a3f;color:#fff;border:2px solid #1b2a3f;padding:10px 14px}' +
    '#hc-banner button:focus-visible{outline:3px solid #80BEAE;outline-offset:2px}' +
    '.hc-settings{background:none;border:0;padding:0;margin:0 0 0 .4em;color:inherit;text-decoration:underline;cursor:pointer;font:inherit}';

  function injectStyle() {
    if (document.getElementById('hc-style')) return;
    var st = document.createElement('style');
    st.id = 'hc-style';
    st.textContent = STYLE;
    document.head.appendChild(st);
  }

  function closeBanner() {
    var b = document.getElementById('hc-banner');
    if (b) b.parentNode.removeChild(b);
  }

  function showBanner() {
    injectStyle();
    if (document.getElementById('hc-banner')) return;
    var b = document.createElement('div');
    b.id = 'hc-banner';
    b.setAttribute('role', 'dialog');
    b.setAttribute('aria-labelledby', 'hc-title');
    b.innerHTML =
      '<h2 id="hc-title">Må vi måle vores annoncer?</h2>' +
      '<p>Hutsol Service ApS vil gerne bruge cookies fra Google Ads til at måle, om vores annoncer fører til forespørgsler og bookinger, og så Google kan optimere visningen af vores annoncer. ' +
      'Hvis du accepterer, sætter Google cookies (fx _gcl_au, 90 dage; alle cookies og levetider står i privatlivspolitikken) og modtager oplysninger om dit besøg: ' +
      'hvilken annonce du kom fra, hvilke sider du ser, tidspunkt, IP-adresse, browser- og enhedsoplysninger og et cookie-id. ' +
      'Google bruger også oplysningerne til egne formål, fx sikkerhed, analyse og annoncering. ' +
      'Vi bruger ikke oplysningerne til personlig annoncering.</p>' +
      '<p>Du kan altid trække samtykket tilbage under »Cookie-indstillinger« nederst på siden. ' +
      '<a href="/privatliv.html#cookies">Læs mere i privatlivspolitikken</a>.</p>' +
      '<div class="hc-btns"><button type="button" data-hc="denied">Afvis</button>' +
      '<button type="button" data-hc="granted">Accepter</button></div>';
    b.addEventListener('click', function (ev) {
      var t = ev.target;
      if (!t || !t.getAttribute) return;
      var choice = t.getAttribute('data-hc');
      if (!choice) return;
      var before = readChoice();
      saveChoice(choice);
      closeBanner();
      if (choice === 'granted') {
        loadGoogle();
      } else if (before === 'granted' || loaded) {
        deleteGoogleCookies();
        window.location.reload();
      } else {
        deleteGoogleCookies();
      }
    });
    document.body.appendChild(b);
  }

  function addSettingsLink() {
    var footer = document.querySelector('footer');
    if (!footer || footer.querySelector('.hc-settings')) return;
    var target = footer.querySelector('.wrap, .job-wrap') || footer;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'hc-settings';
    btn.textContent = 'Cookie-indstillinger';
    btn.addEventListener('click', showBanner);
    target.appendChild(document.createTextNode(' · '));
    target.appendChild(btn);
  }

  function init() {
    injectStyle();
    addSettingsLink();
    var choice = readChoice();
    if (choice === 'granted') loadGoogle();
    else if (choice === null) showBanner();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}());
