import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export default function query(text, params) {
  return pool.query(text, params)
}
