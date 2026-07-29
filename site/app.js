/* ==========================================================================
   Roam — sign-up handling
   Posts every form to a Google Apps Script Web App, which appends a row to
   your Google Sheet. See README.md for the 5-minute setup.
   ========================================================================== */

/* ---------------------------------------------------------------------------
   STEP 1 OF 1 — paste your Apps Script Web App URL between the quotes.
   It looks like: https://script.google.com/macros/s/AKfycb..../exec
   Until you do, the forms will say they aren't connected yet.
   --------------------------------------------------------------------------- */
const SHEET_ENDPOINT = '';


/* --------------------------------------------------------------------------- */

const COPY = {
  heading: 'You\'re on the list.',
  hero:    'We\'ll email you the moment Roam opens in Wellington.',
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
    wants_pass:    interests.includes('Roam Pass')          ? 'yes' : 'no',
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

  if (!SHEET_ENDPOINT) {
    note(form, 'config',
      'Sign-up isn\'t connected yet — add your Google Sheet endpoint in app.js. ' +
      'See README.md for the setup steps.');
    return;
  }

  clearNotes(form);
  if (button) { button.disabled = true; button.textContent = 'Sending…'; }

  try {
    // text/plain keeps this a "simple" request, so the browser skips the
    // CORS preflight that Apps Script can't answer.
    const res = await fetch(SHEET_ENDPOINT, {
      method:   'POST',
      headers:  { 'Content-Type': 'text/plain;charset=utf-8' },
      body:     JSON.stringify(collect(form)),
      redirect: 'follow',
    });

    if (!res.ok) throw new Error('HTTP ' + res.status);
    succeed(form);
  } catch (err) {
    console.error('[roam] sign-up failed:', err);
    if (button) { button.disabled = false; button.textContent = label; }
    note(form, 'error',
      'Something went wrong sending that. Please try again, or email hello@roam.co.nz.');
  }
}

document.querySelectorAll('[data-roam-form]').forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (form.reportValidity && !form.reportValidity()) return;
    send(form);
  });
});
