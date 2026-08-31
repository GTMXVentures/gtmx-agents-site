-- Waitlist signups from gtmxagents.com.
--
-- Lives in D1 rather than the product's Postgres on purpose: marketing data and
-- application data have no reason to share a database, and CLAUDE.md already
-- draws that line ("do not add product/API logic to this site beyond the /api/*
-- seam"). A native D1 binding also means the Worker holds no credential at all
-- — nothing to rotate, nothing to leak, and a compromised marketing Worker
-- cannot reach the product database.
--
-- Apply with:
--   pnpm -C site exec wrangler d1 migrations apply gtmx-agents-site --remote
-- (drop --remote to apply to the local dev database)

CREATE TABLE IF NOT EXISTS waitlist_signups (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,

  -- Lowercased and trimmed by the handler before it gets here. The UNIQUE
  -- constraint is what makes a resubmission a no-op rather than a second row,
  -- via ON CONFLICT DO NOTHING in the insert.
  email       TEXT    NOT NULL UNIQUE,

  -- Unix epoch seconds. SQLite has no native timestamp type, and storing an
  -- integer keeps ordering and range queries trivial; format at read time.
  created_at  INTEGER NOT NULL DEFAULT (unixepoch()),

  -- Which surface the signup came from. Constant today, but a second entry
  -- point (a campaign page, a partner embed) is the obvious next thing, and
  -- backfilling provenance after the fact is impossible.
  source      TEXT    NOT NULL DEFAULT 'gtmxagents.com',

  -- Cloudflare's CF-IPCountry on the incoming request. Free, useful for cohort
  -- planning, and absent in local dev.
  country     TEXT,

  -- Truncated to 300 chars by the handler. Kept for spotting bot floods, not
  -- for analytics.
  user_agent  TEXT
);

-- The read path is "show me the newest signups", so index for that rather than
-- relying on the implicit rowid order.
CREATE INDEX IF NOT EXISTS waitlist_signups_created_at_idx
  ON waitlist_signups (created_at DESC);
