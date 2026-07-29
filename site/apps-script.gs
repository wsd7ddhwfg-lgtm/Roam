/**
 * Roam — sign-up collector
 *
 * Paste this into the Apps Script editor attached to your Google Sheet
 * (Extensions → Apps Script), then deploy it as a Web App.
 * Full steps are in README.md.
 */

// Must match the tab name in your sheet.
const SHEET_NAME = 'Signups';

const COLUMNS = [
  'submitted_at',
  'source',
  'name',
  'email',
  'interests',
  'wants_renting',
  'wants_hosting',
  'wants_pass',
  'message',
  'page',
];

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const sheet = getSheet_();

    // Write the header row once, on first submission.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(COLUMNS);
      sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    sheet.appendRow(COLUMNS.map(function (key) {
      return payload[key] !== undefined ? payload[key] : '';
    }));

    return json_({ ok: true });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: String(err) });
  }
}

// Lets you open the /exec URL in a browser to confirm the deployment is live.
function doGet() {
  return json_({ ok: true, service: 'roam-signups' });
}

function getSheet_() {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  return book.getSheetByName(SHEET_NAME) || book.insertSheet(SHEET_NAME);
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
