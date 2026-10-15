import db from '../../../lib/db'

export default async function handler(req, res) {
  const { magazine } = req.query
  const { rows } = await db(
    `SELECT * FROM ads WHERE magazine_slug = $1 ORDER BY reader_order ASC NULLS LAST`,
    [magazine]
  )
  res.json(rows)
}
