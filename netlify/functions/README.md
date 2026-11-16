# Contact form function

The contact page at `/contact/` posts to `/.netlify/functions/contact`. The
function sends the message over SMTP to the address in `CONTACT_TO`.

## Required environment variables

Set these in **Netlify → Site configuration → Environment variables** (and in a
local `.env` for `netlify dev`). The values mirror the Katisha project.

| Variable | Value |
| --- | --- |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_SECURE` | `false` |
| `SMTP_USER` | `manzialpe@gmail.com` |
| `SMTP_PASS` | Gmail app password (never commit this) |
| `SMTP_FROM` | `Kwanda Corporations <manzialpe@gmail.com>` |
| `CONTACT_TO` | `manzialpe@gmail.com` |

`SMTP_PASS` is the only mandatory value without a default. Until it is set, the
form returns a friendly error asking the visitor to email the address directly.

## Local testing

```bash
cp .env.example .env   # then fill in SMTP_PASS
npx netlify dev
```

The function validates required fields, checks the email format, limits message
length, and uses a hidden honeypot field to reject simple bots.
