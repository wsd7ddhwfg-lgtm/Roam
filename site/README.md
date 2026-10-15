# WheelUp — landing page

Static build of **D5 Citrus Pop** from `../pencil-new.pen`. No build step, no dependencies.

```
site/
  index.html        the page
  style.css         Citrus Pop design system + responsive rules
  app.js                 form handling  ← paste your Google Form settings here
  google-form-setup.gs   creates the Google Form + welcome email
  README.md         this file
```

Open `index.html` in any browser to view it.

---

## Connecting the forms to Google Forms

All three forms (hero, mid-page, closing strip) send to one Google Form, and every new sign-up gets a welcome email from wheelupnz@gmail.com.

**1. Run the setup script**
Signed in as **wheelupnz@gmail.com**, go to [script.google.com](https://script.google.com) → **New project**. Delete the placeholder code, paste in everything from `google-form-setup.gs`, and save. Pick `setup` in the function dropdown and click **Run**. Approve the permissions prompt (it's your own script, so the "unverified app" warning is expected — choose Advanced → Go to project).

**2. Copy the settings**
The Execution log prints a line starting with `{"action":`. Copy that whole line.

**3. Wire it up**
Paste it into `app.js`:

```js
const GOOGLE_FORM = {"action":"https://docs.google.com/forms/d/e/.../formResponse","fields":{...}};
```

Submit a form on the site: the answers show in the Google Form's **Responses** tab and the welcome email arrives a few seconds later.

### What lands in the form

| Question | Notes |
|---|---|
| Name, Email | Email is required, name isn't |
| Interested in | The ticked boxes, comma-joined. Count rows containing "WheelUp Pass" for Pass demand |
| Message | Only from the mid-page form |
| Signed up from | `hero`, `big`, or `closing` — tells you which form converted |
| Page | Full URL, useful once you're running campaign links |

To see responses as a spreadsheet, open the form's **Responses** tab → **Link to Sheets**.

### Changing the welcome email

Edit the text in `sendWelcome` in the script project and save. No redeploy needed. Free Gmail accounts can send about 100 emails a day.

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
