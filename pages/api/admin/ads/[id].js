import db from '../../../../lib/db'
import { requireAdmin } from '../../../../lib/adminAuth'

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return
  const { id } = req.query

  if (req.method === 'PUT') {
    const { photo, cta_label, phone, email, website, address, reader_order } = req.body
    const { rows } = await db(
      `UPDATE ads SET photo=$1, cta_label=$2, phone=$3, email=$4, website=$5, address=$6, reader_order=$7 WHERE id=$8 RETURNING *`,
      [photo, cta_label, phone, email, website, address, reader_order||null, id]
    )
    return res.json(rows[0])
  }

  if (req.method === 'DELETE') {
    await db(`DELETE FROM ads WHERE id=$1`, [id])
    return res.json({ ok: true })
  }

  res.status(405).end()
}
