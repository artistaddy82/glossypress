import db from '../../../../lib/db'
import { requireAdmin } from '../../../../lib/adminAuth'

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return

  if (req.method === 'GET') {
    const { magazine } = req.query
    const { rows } = await db(
      `SELECT * FROM events WHERE magazine_slug=$1 ORDER BY start_time ASC NULLS LAST`,
      [magazine]
    )
    return res.json(rows)
  }

  if (req.method === 'POST') {
    const f = req.body
    const { rows } = await db(
      `INSERT INTO events (magazine_slug, issue_id, title, description, image, location, address,
       start_time, end_time, tags, is_featured, is_editors_pick, is_trending, age_restriction,
       cover_charge, venue_type, is_indoor, audio_link, video_link, website, ticket_url, reader_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22) RETURNING *`,
      [f.magazine_slug, f.issue_id||null, f.title, f.description, f.image, f.location, f.address,
       f.start_time||null, f.end_time||null, f.tags||[], f.is_featured||false, f.is_editors_pick||false,
       f.is_trending||false, f.age_restriction, f.cover_charge, f.venue_type, f.is_indoor,
       f.audio_link, f.video_link, f.website, f.ticket_url, f.reader_order||null]
    )
    return res.status(201).json(rows[0])
  }

  res.status(405).end()
}
