import pool from './database'

export async function initDatabase(): Promise<void> {
  try {
    const client = await pool.connect()
    try {
      // 1. Tabela de votos diários do Craque da Galera
      await client.query(`
        CREATE TABLE IF NOT EXISTS daily_votes (
          id SERIAL PRIMARY KEY,
          vote_hash VARCHAR(64) UNIQUE NOT NULL,
          member_id INT REFERENCES members(id) ON DELETE CASCADE,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `)

      // 2. Índice para otimizar busca por hash
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_daily_votes_hash ON daily_votes(vote_hash);
      `)

      // 3. Coluna de contagem de respeito/votos na tabela de membros
      await client.query(`
        ALTER TABLE members ADD COLUMN IF NOT EXISTS respect_count INT DEFAULT 0;
      `)

      console.log('[Database] Tabelas e colunas do Craque da Galera inicializadas com sucesso.')
    } finally {
      client.release()
    }
  } catch (err) {
    console.error('[Database] Erro ao inicializar tabelas do Craque da Galera:', err)
  }
}
