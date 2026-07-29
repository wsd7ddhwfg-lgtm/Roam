# Roam — landing page

Static build of **D5 Citrus Pop** from `../pencil-new.pen`. No build step, no dependencies.

```
site/
  index.html        the page
  style.css         Citrus Pop design system + responsive rules
  app.js            form handling  ← put your Sheet URL here
  apps-script.gs    paste this into Google Apps Script
  README.md         this file
```

Open `index.html` in any browser to view it.

---

## Connecting the forms to a Google Sheet

All three forms (hero, mid-page, closing strip) post to one endpoint. Takes about five minutes.

**1. Make the sheet**
Create a new Google Sheet. Rename the first tab to exactly `Signups`. Leave it empty — the header row writes itself on the first submission.

**2. Add the script**
In that sheet: **Extensions → Apps Script**. Delete the placeholder `myFunction` code, paste in everything from `apps-script.gs`, and save.

**3. Deploy it**
**Deploy → New deployment → ** gear icon → **Web app**. Set:

| Field | Value |
|---|---|
| Execute as | **Me** |
| Who has access | **Anyone** |

Click **Deploy** and approve the permissions prompt (it's your own script, so the "unverified app" warning is expected — choose Advanced → Go to project).

Copy the **Web app URL**. It ends in `/exec`.

**4. Wire it up**
Open `app.js` and paste the URL into the first line:

```js
const SHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycb.../exec';
```

That's it. Submit the form and a row appears in the sheet.

> **"Who has access" must be Anyone.** With *Anyone with a Google account*, visitors who aren't logged in get a silent failure.

### What lands in the sheet

| Column | Notes |
|---|---|
| `submitted_at` | ISO timestamp from the visitor's browser |
| `source` | `hero`, `big`, or `closing` — tells you which form converted |
| `name`, `email` | `email` is required, `name` isn't |
| `interests` | The ticked boxes, comma-joined |
| `wants_renting` / `wants_hosting` / `wants_pass` | `yes`/`no` columns, so you can chart demand without parsing text |
| `message` | Only from the mid-page form |
| `page` | Full URL, useful once you're running campaign links |

`wants_pass` is the Roam Pass demand signal the plan is built around — the share of `yes` against total rows is the number to watch.

### Re-deploying after script edits

Apps Script pins each deployment to a version. If you edit `apps-script.gs` later, go **Deploy → Manage deployments → ** pencil icon → set Version to **New version** → **Deploy**. The URL stays the same. Creating a *new* deployment instead gives you a new URL and you'd have to update `app.js`.

---

## Deploying the site

It's plain static files, so anything works. Two easy options:

- **Netlify Drop** — drag the `site` folder onto [app.netlify.com/drop](https://app.netlify.com/drop). Live in seconds.
- **Vercel** — `vercel deploy` from inside `site/`, or connect the repo and set the root directory to `site`.

Then point `roamwellington.co.nz` (or whichever `.co.nz` you secure) at it.

---

## Notes on fidelity

Built to match D5 at a 1440px viewport: same palette tokens, same type scale, same section order and spacing. Where the mockup has one fixed width, the build adds behaviour the canvas can't express:

- **Type scales fluidly.** Display sizes use `clamp()` calibrated to hit the mockup's exact px at 1440px, then scale down. The 108px hero headline bottoms out at 40px on a phone.
- **Grids collapse.** Destinations 2-up → 1-up and the How It Works columns stack below 860px; Why Roam's 3-up stacks below 1024px.
- **Nav simplifies.** The three text links hide below 860px, leaving the wordmark and the yellow CTA. If you want a burger menu, that's the place to add it.
- **Icons are inlined.** The nine Lucide glyphs are an SVG sprite in `index.html` — no icon library to load.
- **Photos are the mockup's Unsplash URLs**, served from Unsplash's CDN. For production, download them into a local `img/` folder so the page doesn't depend on someone else's hotlinking policy. The hero shot is by Aleksandr Dalakian ([@mediasekta](https://unsplash.com/@mediasekta)).

### Claim rules

The copy is verbatim from D5, which was already checked against the claim-free rules in `../plan.html` §6. If you edit it, the rule is: intent and identity are fine ("Cover comes with the trip", "Wellington beta is on the way"), specifics are not — no fee percentages, payout timing, launch dates, waitlist counts, insurance terms, or service guarantees.
