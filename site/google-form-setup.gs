/**
 * WheelUp — Google Form sign-ups + welcome email
 *
 * Paste this into a new project at script.google.com while signed in as
 * wheelupnz@gmail.com, then run `setup` once. It:
 *   1. creates the "WheelUp Sign-ups" Google Form,
 *   2. turns on the welcome email for every new sign-up,
 *   3. prints the settings to paste into app.js.
 * Running `setup` again reuses the same form and just prints the settings.
 */

const FORM_TITLE = 'WheelUp Sign-ups';

// Question titles. The website fills these in, so keep them as they are.
const Q = {
  name:      'Name',
  email:     'Email',
  interests: 'Interested in',
  message:   'Message',
  source:    'Signed up from',
  page:      'Page',
};

function setup() {
  const form = getOrCreateForm_();
  ensureWelcomeTrigger_(form);

  const config = {
    action: form.getPublishedUrl().replace(/\/viewform.*$/, '/formResponse'),
    fields: entryIds_(form),
  };

  console.log('All set! Form: ' + form.getEditUrl());
  console.log('COPY EVERYTHING ON THE NEXT LINE:');
  console.log(JSON.stringify(config));
}

// Runs automatically every time someone signs up.
function sendWelcome(e) {
  const answers = {};
  e.response.getItemResponses().forEach(function (r) {
    answers[r.getItem().getTitle()] = String(r.getResponse() || '').trim();
  });

  const email = answers[Q.email] || '';
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return;

  const name = answers[Q.name] || '';

  MailApp.sendEmail({
    to: email,
    name: 'WheelUp',
    subject: 'Welcome to WheelUp!',
    body: welcomeText_(name),
    htmlBody: welcomeHtml_(name),
  });
}

// Plain-text version, for email apps that don't show HTML.
function welcomeText_(name) {
  return [
    name ? 'Kia ora ' + name + ',' : 'Kia ora,',
    '',
    'Welcome to WheelUp, and thank you for signing up! You\'re one of our founding members, and we\'re so glad you\'re here.',
    '',
    'Exciting times ahead! WheelUp is a new way for Wellingtonians to rent cars and campervans from locals, and to earn from their own vehicles when they\'re not using them.',
    '',
    'You\'ll be among the first to hear when we launch, and the first to get access.',
    '',
    'Got a question or an idea? Just reply to this email.',
    '',
    'See you on the road,',
    'The WheelUp team',
  ].join('\n');
}

// Branded version, matching the website's Citrus Pop look. Email apps
// ignore <style> blocks and most web fonts, so every style is inline and
// Anton falls back to Impact.
function welcomeHtml_(name) {
  const C = {
    cream: '#FFFBEB', cream2: '#FEF3C7', text: '#18181B', text2: '#52525B',
    border: '#E4E4E7', accent: '#FACC15', chip: '#854D0E',
  };
  const display = "font-family:Anton,Impact,'Arial Narrow Bold',sans-serif;font-weight:400;text-transform:uppercase;";
  const bodyFont = "font-family:Inter,'Helvetica Neue',Arial,sans-serif;";
  const mono = "font-family:'Geist Mono',Menlo,Consolas,monospace;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;";
  const p = 'margin:0 0 16px;font-size:16px;line-height:1.6;color:' + C.text2 + ';';
  const hello = name ? 'Kia ora ' + escapeHtml_(name) + ',' : 'Kia ora,';

  const step = function (n, text) {
    return '<tr>' +
      '<td valign="top" style="padding:0 12px 12px 0;' + display + 'font-size:20px;color:' + C.chip + ';">0' + n + '</td>' +
      '<td valign="top" style="padding:3px 0 12px;' + bodyFont + 'font-size:15px;line-height:1.5;color:' + C.text + ';">' + text + '</td>' +
    '</tr>';
  };

  return '<!doctype html><html><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<link href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;600&family=Geist+Mono:wght@600&display=swap" rel="stylesheet">' +
    '</head><body style="margin:0;padding:0;background:' + C.cream + ';">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:' + C.cream + ';">' +
    '<tr><td align="center" style="padding:32px 16px;">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">' +

      // Logo
      '<tr><td style="padding:0 0 24px;' + display + 'font-size:28px;letter-spacing:1px;color:' + C.text + ';">WheelUp</td></tr>' +

      // Card
      '<tr><td style="background:#FFFFFF;border:1px solid ' + C.border + ';border-radius:10px;padding:40px 32px;">' +
        '<table role="presentation" cellpadding="0" cellspacing="0"><tr>' +
          '<td style="background:' + C.cream2 + ';border-radius:9999px;padding:8px 16px;' + mono + 'font-size:11px;color:' + C.chip + ';">' +
            '<span style="color:' + C.accent + ';font-size:14px;">&#9679;</span>&nbsp; Wellington &middot; Founding member' +
          '</td>' +
        '</tr></table>' +
        '<h1 style="margin:24px 0 24px;' + display + 'font-size:44px;line-height:1.05;letter-spacing:-0.5px;color:' + C.text + ';">You\'re on the list.</h1>' +
        '<div style="' + bodyFont + '">' +
          '<p style="' + p + 'color:' + C.text + ';font-weight:600;">' + hello + '</p>' +
          '<p style="' + p + '">Welcome to WheelUp, and thank you for signing up! You\'re one of our founding members, and we\'re so glad you\'re here.</p>' +
          '<p style="' + p + '">Exciting times ahead! WheelUp is a new way for Wellingtonians to rent cars and campervans from locals, and to earn from their own vehicles when they\'re not using them.</p>' +
        '</div>' +

        // What happens next
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 24px;background:' + C.cream + ';border-left:4px solid ' + C.accent + ';border-radius:8px;">' +
          '<tr><td style="padding:24px 24px 12px;">' +
            '<p style="margin:0 0 16px;' + mono + 'font-size:12px;color:' + C.chip + ';">What happens next</p>' +
            '<table role="presentation" cellpadding="0" cellspacing="0">' +
              step(1, 'You\'ll be among the first to hear when we launch.') +
              step(2, 'Founding members get first access, before everyone else.') +
              step(3, 'Got a question or an idea? Just reply to this email.') +
            '</table>' +
          '</td></tr>' +
        '</table>' +

        '<p style="margin:0;' + bodyFont + 'font-size:16px;line-height:1.6;color:' + C.text + ';">See you on the road,<br><strong>The WheelUp team</strong></p>' +
      '</td></tr>' +

      // Footer
      '<tr><td style="padding:24px 0 0;">' +
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:' + C.text + ';border-radius:10px;">' +
          '<tr><td style="padding:24px 32px;">' +
            '<div style="' + display + 'font-size:22px;letter-spacing:1px;color:' + C.accent + ';">WheelUp <span style="' + mono + 'font-size:11px;color:#A1A1AA;">Wellington</span></div>' +
            '<div style="padding-top:8px;' + mono + 'font-size:11px;color:#A1A1AA;">' +
              '<a href="mailto:wheelupnz@gmail.com" style="color:#A1A1AA;text-decoration:none;">wheelupnz@gmail.com</a> &middot; Te Whanganui-a-Tara' +
            '</div>' +
          '</td></tr>' +
        '</table>' +
      '</td></tr>' +

    '</table>' +
    '</td></tr></table></body></html>';
}

function escapeHtml_(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function getOrCreateForm_() {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('FORM_ID');
  if (id) {
    try { return FormApp.openById(id); } catch (err) { /* deleted — make a new one */ }
  }

  const form = FormApp.create(FORM_TITLE)
    .setDescription('Founding member sign-ups from the WheelUp website.')
    .setCollectEmail(false)
    .setConfirmationMessage('Thanks — you\'re on the WheelUp list!');

  form.addTextItem().setTitle(Q.name);
  form.addTextItem().setTitle(Q.email).setRequired(true);
  form.addTextItem().setTitle(Q.interests);
  form.addParagraphTextItem().setTitle(Q.message);
  form.addTextItem().setTitle(Q.source);
  form.addTextItem().setTitle(Q.page);

  props.setProperty('FORM_ID', form.getId());
  return form;
}

function ensureWelcomeTrigger_(form) {
  const exists = ScriptApp.getProjectTriggers().some(function (t) {
    return t.getHandlerFunction() === 'sendWelcome';
  });
  if (!exists) {
    ScriptApp.newTrigger('sendWelcome').forForm(form).onFormSubmit().create();
  }
}

// The website has to post each answer as "entry.<number>". Google only
// exposes those numbers through a pre-filled link, so build one and read them.
function entryIds_(form) {
  const byTitle = {};
  form.getItems().forEach(function (item) { byTitle[item.getTitle()] = item; });

  const response = form.createResponse();
  const marks = {};
  Object.keys(Q).forEach(function (key) {
    const item = byTitle[Q[key]];
    const mark = 'WHEELUP' + key.toUpperCase();
    marks[key] = mark;
    const typed = item.getType() === FormApp.ItemType.PARAGRAPH_TEXT
      ? item.asParagraphTextItem() : item.asTextItem();
    response.withItemResponse(typed.createResponse(mark));
  });

  const url = response.toPrefilledUrl();
  const fields = {};
  Object.keys(marks).forEach(function (key) {
    const m = url.match(new RegExp('(entry\\.\\d+)=' + marks[key]));
    if (m) fields[key] = m[1];
  });
  return fields;
}
