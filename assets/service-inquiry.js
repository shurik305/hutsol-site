// Fixed task allowlist. URL input is never inserted as HTML or sent as an unknown task.
(function () {
  'use strict';
  var tasks = {
  "haekklipning": {
    "service": "Have- og grøn vedligeholdelse",
    "label": "Hækklipning",
    "hint": "Hækkens længde, højde og cirka bredde. Hvilke sider der er adgang til, og hvor afklippet kan lægges. Fotos af hækken, by og ønsket tidspunkt."
  },
  "haveoprydning": {
    "service": "Have- og grøn vedligeholdelse",
    "label": "Haveoprydning",
    "hint": "Fotos og cirka areal af de områder, der skal ryddes op. Dine vigtigste opgaver og hvad der skal bevares. Adgangsforhold og om haveaffaldet skal køres væk."
  },
  "graesslaaning": {
    "service": "Have- og grøn vedligeholdelse",
    "label": "Græsslåning",
    "hint": "Plænens cirka areal og græssets nuværende højde. Fotos, skråninger, forhindringer og bredden på adgangen. Ønsket hyppighed og håndtering af afklip."
  },
  "ukrudt": {
    "service": "Have- og grøn vedligeholdelse",
    "label": "Ukrudtsfjernelse",
    "hint": "Fotos og cirka areal af bedet eller haveområdet. Hvilke planter der skal bevares. Ønsket omfang, adgang og håndtering af affaldet."
  },
  "haveaffald": {
    "service": "Have- og grøn vedligeholdelse",
    "label": "Bortkørsel af haveaffald",
    "hint": "Fotos af hele bunken og en beskrivelse af indholdet. Cirka mål eller mængde og placering på grunden. Adgang, afstand til trailer og by."
  },
  "fast-rengoering": {
    "service": "Privatrengøring",
    "label": "Fast privatrengøring",
    "hint": "Boligens areal, antal rum og badeværelser. Ønsket hyppighed, prioriteringer og adgang. Særlige overflader, kæledyr og ønsker til rengøringsmidler."
  },
  "hovedrengoering": {
    "service": "Privatrengøring",
    "label": "Hovedrengøring",
    "hint": "Areal, antal rum og badeværelser. Aktuelle fotos af de områder, der kræver mest arbejde. Ønsker til detaljer, indvendige skabe eller apparater og adgang."
  },
  "flytterengoering": {
    "service": "Privatrengøring",
    "label": "Flytterengøring",
    "hint": "Areal, rum, badeværelser og aktuelle fotos. Dato for adgang, ønsket afslutning og om boligen er tom. Krav eller liste fra udlejer samt ønskede ekstraopgaver."
  },
  "kontorrengoering": {
    "service": "Erhvervsrengøring",
    "label": "Kontorrengøring",
    "hint": "Areal, antal arbejdspladser, toiletter og fællesrum. Ønsket hyppighed og mulige arbejdstider. Adgang, nøgler, alarm og krav til materialer."
  },
  "butiksrengoering": {
    "service": "Erhvervsrengøring",
    "label": "Butiksrengøring",
    "hint": "Areal, gulvtyper, personaleområder og toiletter. Åbningstider, ønsket hyppighed og mulige rengøringstider. Adgang, alarm og hensyn til varer og inventar."
  },
  "trappevask": {
    "service": "Erhvervsrengøring",
    "label": "Trappevask og fællesarealer",
    "hint": "Antal opgange og etager samt fotos af belægningen. Ønsket hyppighed og hvilke fællesrum der skal indgå. Nøgleadgang, tidsrum og kontaktperson."
  },
  "byggepladsrengoering": {
    "service": "Erhvervsrengøring",
    "label": "Rengøring efter håndværkere",
    "hint": "Fotos, areal og materialer på gulve og andre overflader. Oplysninger om støv og rester samt tidspunkt for håndværkernes afslutning. Adgang, vand, strøm og ønsket tidspunkt."
  },
  "vinduespudser": {
    "service": "Vinduespolering",
    "label": "Vinduespudsning",
    "hint": "Antal og type af vinduer samt fotos. Etage, adgang og hvilke sider der skal pudses. Ønsket hyppighed og eventuelle særlige rester."
  }
};
  var key = new URLSearchParams(location.search).get('task');
  if (!Object.prototype.hasOwnProperty.call(tasks, key)) return;
  var task = tasks[key];
  var form = document.getElementById('booking-form');
  var field = document.getElementById('task-choice');
  var summary = document.getElementById('task-summary');
  var hint = document.getElementById('task-hint');
  if (!form || !field || !summary || !hint) return;
  function update() {
    var selected = form.querySelector('input[name="service"]:checked');
    var active = !!selected && selected.value === task.service;
    field.disabled = !active;
    field.value = active ? task.label : '';
    summary.hidden = !active;
    hint.hidden = !active;
    summary.textContent = active ? 'Valgt opgave: ' + task.label + '. Du kan ændre service nedenfor.' : '';
    hint.textContent = active ? task.hint : '';
  }
  form.querySelectorAll('input[name="service"]').forEach(function (radio) {
    radio.addEventListener('change', update);
  });
  form.addEventListener('reset', function () { setTimeout(update, 0); });
  update();
}());
