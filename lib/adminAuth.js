import { parse } from 'cookie'

export function requireAdmin(req, res) {
  const cookies = req.cookies || parse(req.headers.cookie || '')
  const token = cookies.admin_token
  if (!token || token !== process.env.ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Unauthorized' })
    return false
  }
  return true
}
