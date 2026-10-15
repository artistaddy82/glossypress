import db from '../../../../lib/db'
import { requireAdmin } from '../../../../lib/adminAuth'

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return

  if (req.method === 'GET') {
    const { rows } = await db(`SELECT * FROM magazines ORDER BY brand_name`)
    return res.json(rows)
  }

  if (req.method === 'POST') {
    const { slug, brand_name, color_primary, color_secondary, color_accent, color_dark, color_button, contact_email, contact_phone, tags } = req.body
    const { rows } = await db(
      `INSERT INTO magazines (slug, brand_name, color_primary, color_secondary, color_accent, color_dark, color_button, contact_email, contact_phone, tags)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [slug, brand_name, color_primary || '#FF0AE2', color_secondary || '#00ADEF',
       color_accent || '#FFF30A', color_dark || '#000E4C', color_button || '#7A4E7C',
       contact_email, contact_phone, tags || []]
    )
    return res.status(201).json(rows[0])
  }

  res.status(405).end()
}
