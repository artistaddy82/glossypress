import db from '../../../../lib/db'
import { requireAdmin } from '../../../../lib/adminAuth'

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return
  const { slug } = req.query

  if (req.method === 'PUT') {
    const { brand_name, color_primary, color_secondary, color_accent, color_dark, color_button, contact_email, contact_phone, tags } = req.body
    const { rows } = await db(
      `UPDATE magazines SET brand_name=$1, color_primary=$2, color_secondary=$3,
       color_accent=$4, color_dark=$5, color_button=$6, contact_email=$7,
       contact_phone=$8, tags=$9 WHERE slug=$10 RETURNING *`,
      [brand_name, color_primary, color_secondary, color_accent, color_dark, color_button, contact_email, contact_phone, tags, slug]
    )
    return res.json(rows[0])
  }

  if (req.method === 'DELETE') {
    await db(`DELETE FROM magazines WHERE slug=$1`, [slug])
    return res.json({ ok: true })
  }

  res.status(405).end()
}
