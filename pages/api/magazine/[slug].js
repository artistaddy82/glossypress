import db from '../../../lib/db'

export default async function handler(req, res) {
  const { slug } = req.query

  const { rows } = await db(
    `SELECT m.*, i.id AS issue_id, i.label AS issue_label, i.cover_image
     FROM magazines m
     LEFT JOIN issues i ON i.magazine_slug = m.slug AND i.is_current = TRUE
     WHERE m.slug = $1`,
    [slug]
  )

  if (!rows.length) return res.status(404).json({ error: 'Magazine not found' })
  res.json(rows[0])
}
