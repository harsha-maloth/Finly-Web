# Finly

A simple expense tracker that runs in the browser. No server, no setup — just open the page and use it.

Live at: `https://harsha-maloth.github.io/Finly-Web/`

---

## What it does

- Track income and expenses by month
- Organise transactions into categories
- See a breakdown of where your money went
- See your savings rate for the month
- Data saves in your browser (localStorage) so it stays between visits

---

## How to use

Go to the live site, create an account, and start adding transactions.

To try it without signing up, use the demo account:
- Username: `demo`
- Password: `demo123`

---

## Running it locally

No install needed. Just open the file:

```bash
git clone https://github.com/airgem/finly.git
cd finly
# open index.html in your browser
```

Or with Python if you prefer a local server:

```bash
python3 -m http.server 8000
# then go to http://localhost:8000
```

---

## Project structure

```
finly/
├── index.html      # the entire app (single file)
├── README.md
├── LICENSE
└── .gitignore
```

Everything lives in `index.html` — React loads from a CDN, so there's no build step.

---

## Tech used

- React 18 (via CDN, no npm)
- Babel standalone (JSX in the browser)
- Google Fonts (DM Serif Display, DM Mono, Outfit)
- localStorage for saving data

---

## Limitations

- Data is stored per browser — clearing browser data will wipe it
- No sync between devices
- Accounts are local to your browser, not shared

---

## License

MIT — do whatever you want with it.

---

*Originally inspired by [Finly](https://github.com/airgem/Finly-main), a desktop app built with Python and PySide6.*
