import 'server-only'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '@/db/schema'

function createDb() {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set')
  }

  const client = postgres(connectionString, { prepare: false })
  return drizzle(client, { schema })
}

// Lazy initialization — only connects when first used (not at import time)
let _db: ReturnType<typeof createDb> | undefined

export function getDb() {
  if (!_db) {
    _db = createDb()
  }
  return _db
}

// Convenience export — same as getDb() for most use cases
export const db = new Proxy({} as ReturnType<typeof createDb>, {
  get(_target, prop) {
    return getDb()[prop as keyof ReturnType<typeof createDb>]
  },
})