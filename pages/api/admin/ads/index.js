import db from '../../../../lib/db'
import { requireAdmin } from '../../../../lib/adminAuth'

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return

  if (req.method === 'GET') {
    const { magazine } = req.query
    const { rows } = await db(`SELECT * FROM ads WHERE magazine_slug=$1 ORDER BY reader_order ASC NULLS LAST`, [magazine])
    return res.json(rows)
  }

  if (req.method === 'POST') {
    const { magazine_slug, issue_id, photo, cta_label, phone, email, website, address, reader_order } = req.body
    const { rows } = await db(
      `INSERT INTO ads (magazine_slug, issue_id, photo, cta_label, phone, email, website, address, reader_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [magazine_slug, issue_id||null, photo, cta_label, phone, email, website, address, reader_order||null]
    )
    return res.status(201).json(rows[0])
  }

  res.status(405).end()
}
