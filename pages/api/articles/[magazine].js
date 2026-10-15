import db from '../../../lib/db'

export default async function handler(req, res) {
  const { magazine, top_stories } = req.query

  let text = `
    SELECT a.*, i.label AS issue_label
    FROM articles a
    LEFT JOIN issues i ON i.id = a.issue_id
    WHERE a.magazine_slug = $1
  `
  const params = [magazine]

  if (top_stories === '1') {
    text += ' AND a.is_top_story = TRUE'
  }

  text += ' ORDER BY a.reader_order ASC NULLS LAST, a.created_at DESC'

  const { rows } = await db(text, params)
  res.json(rows)
}
