-- GlossyPress schema

CREATE TABLE IF NOT EXISTS magazines (
  slug          TEXT PRIMARY KEY,
  brand_name    TEXT NOT NULL,
  color_primary TEXT NOT NULL DEFAULT '#FF0AE2',   -- magenta (OUTAVL default)
  color_secondary TEXT NOT NULL DEFAULT '#00ADEF', -- cyan
  color_accent  TEXT NOT NULL DEFAULT '#FFF30A',   -- yellow
  color_dark    TEXT NOT NULL DEFAULT '#000E4C',   -- navy
  color_button  TEXT NOT NULL DEFAULT '#7A4E7C',   -- purple
  contact_email TEXT,
  contact_phone TEXT,
  tags          TEXT[] NOT NULL DEFAULT '{}',
  feed_interval_hours INT NOT NULL DEFAULT 24,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS issues (
  id            SERIAL PRIMARY KEY,
  magazine_slug TEXT NOT NULL REFERENCES magazines(slug) ON DELETE CASCADE,
  label         TEXT NOT NULL,
  cover_image   TEXT,
  published_at  DATE,
  is_current    BOOLEAN NOT NULL DEFAULT FALSE
);

-- enforce one current issue per magazine
CREATE UNIQUE INDEX IF NOT EXISTS issues_one_current
  ON issues (magazine_slug)
  WHERE is_current = TRUE;

CREATE TABLE IF NOT EXISTS articles (
  id            SERIAL PRIMARY KEY,
  magazine_slug TEXT NOT NULL REFERENCES magazines(slug) ON DELETE CASCADE,
  issue_id      INT REFERENCES issues(id) ON DELETE SET NULL,
  hero_type     TEXT NOT NULL DEFAULT 'image',  -- image | video
  hero_image    TEXT,
  hero_video_url TEXT,
  title         TEXT NOT NULL,
  category      TEXT,
  tags          TEXT[] NOT NULL DEFAULT '{}',
  body          TEXT,
  is_top_story  BOOLEAN NOT NULL DEFAULT FALSE,
  reader_order  INT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ads (
  id            SERIAL PRIMARY KEY,
  magazine_slug TEXT NOT NULL REFERENCES magazines(slug) ON DELETE CASCADE,
  issue_id      INT REFERENCES issues(id) ON DELETE SET NULL,
  photo         TEXT,
  cta_label     TEXT,
  phone         TEXT,
  email         TEXT,
  website       TEXT,
  address       TEXT,
  reader_order  INT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  id              SERIAL PRIMARY KEY,
  magazine_slug   TEXT NOT NULL REFERENCES magazines(slug) ON DELETE CASCADE,
  issue_id        INT REFERENCES issues(id) ON DELETE SET NULL,
  title           TEXT NOT NULL,
  description     TEXT,
  image           TEXT,
  location        TEXT,
  address         TEXT,
  start_time      TIMESTAMPTZ,
  end_time        TIMESTAMPTZ,
  tags            TEXT[] NOT NULL DEFAULT '{}',
  is_featured     BOOLEAN NOT NULL DEFAULT FALSE,
  is_editors_pick BOOLEAN NOT NULL DEFAULT FALSE,
  is_trending     BOOLEAN NOT NULL DEFAULT FALSE,
  age_restriction TEXT,
  cover_charge    TEXT,
  venue_type      TEXT,
  is_indoor       BOOLEAN,
  audio_link      TEXT,
  video_link      TEXT,
  website         TEXT,
  ticket_url      TEXT,
  reader_order    INT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS seen_posts (
  id            SERIAL PRIMARY KEY,
  magazine_slug TEXT NOT NULL REFERENCES magazines(slug) ON DELETE CASCADE,
  issue_id      INT REFERENCES issues(id) ON DELETE SET NULL,
  photo         TEXT NOT NULL,
  caption       TEXT,
  author        TEXT,
  reader_order  INT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- seed: OUTAVL as the first magazine
INSERT INTO magazines (slug, brand_name, color_primary, color_secondary, color_accent, color_dark, color_button, tags)
VALUES (
  'outavl',
  'OUTAVL',
  '#FF0AE2',
  '#00ADEF',
  '#FFF30A',
  '#000E4C',
  '#7A4E7C',
  ARRAY[
    'Music', 'Food & Drink', 'Art', 'Nightlife', 'Sports', 'Comedy',
    'Theatre', 'Film', 'Outdoor', 'Family', 'Fitness', 'Business',
    'Education', 'Community', 'Fashion', 'Tech', 'Gaming', 'Wellness',
    'Charity', 'Happy Hour', 'Live Music'
  ]
) ON CONFLICT (slug) DO NOTHING;
