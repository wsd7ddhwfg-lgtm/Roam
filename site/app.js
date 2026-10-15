/* ==========================================================================
   WheelUp — sign-up handling
   Sends every form to the "WheelUp Sign-ups" Google Form. A script on that
   form emails each new sign-up a welcome note. See README.md for setup.
   ========================================================================== */

/* ---------------------------------------------------------------------------
   STEP 1 OF 1 — paste the line that google-form-setup.gs prints between the
   braces. It looks like:
   {"action":"https://docs.google.com/forms/d/e/.../formResponse","fields":{...}}
   Until you do, the forms will say they aren't connected yet.
   --------------------------------------------------------------------------- */
const GOOGLE_FORM = {"action":"https://docs.google.com/forms/d/e/1FAIpQLScPOwgFnIlCIpcZWwStrs8D61FADl3eywRbxTx2BfFCqWjqUw/formResponse","fields":{"name":"entry.1196445564","email":"entry.843956254","interests":"entry.1159549245","message":"entry.1657922731","source":"entry.546509922","page":"entry.673647982"}};


/* --------------------------------------------------------------------------- */

const COPY = {
  heading: 'You\'re on the list.',
  hero:    'We\'ll email you the moment WheelUp opens in Wellington.',
  big:     'Cheers — that\'s you locked in as a founding signup.',
  closing: 'That\'s it. We\'ll be in touch when there\'s something to share.',
};

function collect(form) {
  const data = new FormData(form);
  const interests = data.getAll('interest');

  return {
    source:    form.dataset.source || 'unknown',
    name:      (data.get('name')    || '').toString().trim(),
    email:     (data.get('email')   || '').toString().trim(),
    message:   (data.get('message') || '').toString().trim(),
    interests: interests.join(', '),
    // Broken out so you can chart Pass demand straight off a sheet column
    wants_renting: interests.includes('Renting a vehicle')  ? 'yes' : 'no',
    wants_hosting: interests.includes('Listing my vehicle') ? 'yes' : 'no',
    wants_pass:    interests.includes('WheelUp Pass')          ? 'yes' : 'no',
    submitted_at:  new Date().toISOString(),
    page:          location.href,
  };
}

function clearNotes(form) {
  form.querySelectorAll('.form-note').forEach(n => n.remove());
}

function note(form, kind, text) {
  clearNotes(form);
  const p = document.createElement('p');
  p.className = 'form-note ' + kind;
  p.setAttribute('role', 'status');
  p.textContent = text;
  form.appendChild(p);
}

function succeed(form) {
  const wrap = document.createElement('div');
  wrap.className = 'form-done';
  wrap.setAttribute('role', 'status');

  const h = document.createElement('p');
  h.className = 'display';
  h.textContent = COPY.heading;

  const p = document.createElement('p');
  p.textContent = COPY[form.dataset.source] || COPY.hero;

  wrap.append(h, p);
  form.replaceChildren(wrap);
  wrap.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

async function send(form) {
  const button = form.querySelector('button[type="submit"]');
  const label  = button ? button.textContent : '';

  if (!GOOGLE_FORM.action || !GOOGLE_FORM.fields) {
    note(form, 'config',
      'Sign-up isn\'t connected yet — add your Google Form settings in app.js. ' +
      'See README.md for the setup steps.');
    return;
  }

  clearNotes(form);
  if (button) { button.disabled = true; button.textContent = 'Sending…'; }

  try {
    const answers = collect(form);
    const body = new URLSearchParams();
    Object.entries(GOOGLE_FORM.fields).forEach(([key, entry]) => {
      if (answers[key]) body.append(entry, answers[key]);
    });

    // Google Forms doesn't send CORS headers, so the reply can't be read.
    // no-cors still delivers the answers; a network failure still throws.
    await fetch(GOOGLE_FORM.action, { method: 'POST', mode: 'no-cors', body });
    succeed(form);
  } catch (err) {
    console.error('[wheelup] sign-up failed:', err);
    if (button) { button.disabled = false; button.textContent = label; }
    note(form, 'error',
      'Something went wrong sending that. Please try again, or email wheelupnz@gmail.com.');
  }
}

document.querySelectorAll('[data-roam-form]').forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (form.reportValidity && !form.reportValidity()) return;
    send(form);
  });
});
