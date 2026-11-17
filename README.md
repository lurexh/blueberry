# BlueberryUB

BlueberryUB opens to a radial home screen with Browser and Apps options. The
Browser option opens the tabbed browser at `/browser.html`.
The browser uses the official Scramjet proxy bootstrap, searches non-URL text with
DuckDuckGo, and adapts to the device viewport.

## Run locally

```sh
npm install
npm run dev
```

Open <http://localhost:3030>. The bootstrap downloads its compatible Scramjet
runtime packages on first startup, so the server needs internet access. Set
`PORT` to use a different port.

Scramjet is experimental. Some websites may not load because they block proxying,
embedded browsing, or features the browser does not support. No proxy can
guarantee that every URL works.

## Supabase accounts and history

The local Supabase URL and publishable key are read from the ignored `.env` file.
Never put a Supabase secret/service-role key in browser code.

Enable email sign-in and allow the current app origin in Authentication → URL
Configuration. Run the original profiles migration, then
`supabase/migrations/20261015000100_history_and_remove_admin.sql` in Supabase SQL
Editor. The second migration adds private browsing history and removes the unused
moderation tables.

Deploy the self-delete function:

```sh
npx supabase functions deploy delete-account --project-ref bizsbvyaktrtkitayqkm
```

Create an account at `/profile.html` to sync a display name and optionally save
history. History can be paused or cleared from Profile.

## Static app settings

The static app's Settings menu includes General (English and Spanish for the
home screen and settings), Privacy, Proxy, and About pages. The
privacy page explains that the app does not disguise destination websites and
that session history does not conceal activity from sites, proxy providers, or
network administrators. About lists the app version and upstream project credits.
The static app tab is titled BlueberryUB and uses `logo/blueub.png` for its
favicon and app branding.

## Apps

The Apps view in `static/index.svg` displays a Main Page shortcut followed by
the 12 supplied app logos in a responsive grid with up to six items per row.
Selecting an app opens that site in the built-in browser. The browser has a
Main Page logo shortcut below the address bar. The tab strip supports up to 15
tabs and shrinks tabs as needed; the static browser does not include user-managed
bookmarks.

The app logos are stored in `apps/logos/` and are referenced relative to the
static app so they work from the versioned jsDelivr URL.

The Apps grid is user-editable: the Edit apps button lets you add, reorder, and
remove shortcuts, saved in localStorage. The General settings page also has a
search engine picker, and the Privacy page includes the tab cloaker presets.
The app is themed for the season (Christmas palette and santa hats on the
logos), shows a countdown to Christmas on the home screen, and hides two
easter eggs: the Konami code and clicking the hub logo seven times quickly.

## Deploy

The stable link to share is the GitHub Pages URL:
<https://lurexh.github.io/blueberry/static/index.svg>. The `Deploy static
browser to GitHub Pages` workflow publishes `static/` after every push to
`main`, and Pages uses a short cache so updates appear within minutes.

The jsDelivr URL <https://cdn.jsdelivr.net/gh/lurexh/blueberry@main/static/index.svg>
also works, but jsDelivr sends a 7-day browser cache header on `@main` links,
so browsers keep serving their old copy even after the CDN is purged. The
`Purge jsDelivr cache` workflow refreshes the CDN after each push, every six
hours, and on manual dispatch (it retries throttled purges and verifies the
result), but readers may still need a hard refresh or a `?v=N` cache-busting
query to see the newest build. Do not use the `raw.githubusercontent.com` file
URL as an app host: GitHub serves raw files with a sandbox policy that blocks
the app's scripts.