import db from '../../../../lib/db'
import { requireAdmin } from '../../../../lib/adminAuth'

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return
  const { id } = req.query

  if (req.method === 'PUT') {
    const { hero_type, hero_image, hero_video_url, title, category, tags, body, is_top_story, reader_order } = req.body
    const { rows } = await db(
      `UPDATE articles SET hero_type=$1, hero_image=$2, hero_video_url=$3, title=$4,
       category=$5, tags=$6, body=$7, is_top_story=$8, reader_order=$9 WHERE id=$10 RETURNING *`,
      [hero_type, hero_image, hero_video_url, title, category, tags || [], body, is_top_story, reader_order, id]
    )
    return res.json(rows[0])
  }

  if (req.method === 'DELETE') {
    await db(`DELETE FROM articles WHERE id=$1`, [id])
    return res.json({ ok: true })
  }

  res.status(405).end()
}
