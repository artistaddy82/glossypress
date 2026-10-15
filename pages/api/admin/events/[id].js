import db from '../../../../lib/db'
import { requireAdmin } from '../../../../lib/adminAuth'

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return
  const { id } = req.query

  if (req.method === 'PUT') {
    const f = req.body
    const { rows } = await db(
      `UPDATE events SET title=$1, description=$2, image=$3, location=$4, address=$5,
       start_time=$6, end_time=$7, tags=$8, is_featured=$9, is_editors_pick=$10,
       is_trending=$11, age_restriction=$12, cover_charge=$13, venue_type=$14,
       is_indoor=$15, audio_link=$16, video_link=$17, website=$18, ticket_url=$19,
       reader_order=$20 WHERE id=$21 RETURNING *`,
      [f.title, f.description, f.image, f.location, f.address, f.start_time||null,
       f.end_time||null, f.tags||[], f.is_featured, f.is_editors_pick, f.is_trending,
       f.age_restriction, f.cover_charge, f.venue_type, f.is_indoor, f.audio_link,
       f.video_link, f.website, f.ticket_url, f.reader_order||null, id]
    )
    return res.json(rows[0])
  }

  if (req.method === 'DELETE') {
    await db(`DELETE FROM events WHERE id=$1`, [id])
    return res.json({ ok: true })
  }

  res.status(405).end()
}
