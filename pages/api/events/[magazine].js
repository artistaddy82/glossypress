import db from '../../../lib/db'

export default async function handler(req, res) {
  const { magazine, tag, sort, time_of_day } = req.query

  let text = `
    SELECT * FROM events
    WHERE magazine_slug = $1
      AND (start_time IS NULL OR start_time >= NOW())
  `
  const params = [magazine]

  if (tag) {
    params.push(tag)
    text += ` AND $${params.length} = ANY(tags)`
  }

  if (time_of_day === 'morning') text += ` AND EXTRACT(HOUR FROM start_time) < 12`
  if (time_of_day === 'afternoon') text += ` AND EXTRACT(HOUR FROM start_time) BETWEEN 12 AND 17`
  if (time_of_day === 'evening') text += ` AND EXTRACT(HOUR FROM start_time) >= 18`

  text += sort === 'trending'
    ? ' ORDER BY is_trending DESC, start_time ASC'
    : ' ORDER BY start_time ASC'

  const { rows } = await db(text, params)
  res.json(rows)
}
