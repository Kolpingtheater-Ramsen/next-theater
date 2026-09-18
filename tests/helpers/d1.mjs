import { DatabaseSync } from 'node:sqlite'
import { readFileSync, readdirSync } from 'node:fs'

// Execute the real migrations and SQL, with D1's transactional batch semantics.
export function localD1() {
  const sqlite = new DatabaseSync(':memory:')
  sqlite.exec('PRAGMA foreign_keys = ON')
  for (const file of readdirSync('migrations').filter(file => file.endsWith('.sql')).sort()) {
    sqlite.exec(readFileSync(`migrations/${file}`, 'utf8'))
  }
  const db = {
    prepare(sql) {
      let values = []
      return {
        bind(...args) { values = args; return this },
        async first() { const row = sqlite.prepare(sql).get(...values); return row ? { ...row } : null },
        execute() {
          const results = sqlite.prepare(sql).all(...values).map(row => ({ ...row }))
          return { success: true, results, meta: { changes: sqlite.prepare('SELECT changes() AS count').get().count } }
        },
        async all() { return this.execute() },
        async run() { return this.execute() },
      }
    },
    async batch(statements) {
      sqlite.exec('BEGIN')
      try {
        const result = statements.map(statement => statement.execute())
        sqlite.exec('COMMIT')
        return result
      } catch (error) { sqlite.exec('ROLLBACK'); throw error }
    },
  }
  return { sqlite, db }
}
