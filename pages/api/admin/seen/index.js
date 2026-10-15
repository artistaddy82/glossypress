import db from '../../../../lib/db'
import { requireAdmin } from '../../../../lib/adminAuth'

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return

  if (req.method === 'GET') {
    const { magazine } = req.query
    const { rows } = await db(`SELECT * FROM seen_posts WHERE magazine_slug=$1 ORDER BY reader_order ASC NULLS LAST, created_at DESC`, [magazine])
    return res.json(rows)
  }

  if (req.method === 'POST') {
    const { magazine_slug, issue_id, photo, caption, author, reader_order } = req.body
    const { rows } = await db(
      `INSERT INTO seen_posts (magazine_slug, issue_id, photo, caption, author, reader_order)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [magazine_slug, issue_id||null, photo, caption, author, reader_order||null]
    )
    return res.status(201).json(rows[0])
  }

  res.status(405).end()
}
