import db from '../../../../lib/db'
import { requireAdmin } from '../../../../lib/adminAuth'

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return
  const { id } = req.query

  if (req.method === 'PUT') {
    const { photo, caption, author, reader_order } = req.body
    const { rows } = await db(
      `UPDATE seen_posts SET photo=$1, caption=$2, author=$3, reader_order=$4 WHERE id=$5 RETURNING *`,
      [photo, caption, author, reader_order||null, id]
    )
    return res.json(rows[0])
  }

  if (req.method === 'DELETE') {
    await db(`DELETE FROM seen_posts WHERE id=$1`, [id])
    return res.json({ ok: true })
  }

  res.status(405).end()
}
