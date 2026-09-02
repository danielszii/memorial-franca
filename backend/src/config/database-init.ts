import pool from './database'

export async function initDatabase(): Promise<void> {
  try {
    const client = await pool.connect()
    try {
      // 1. Tabela de votos diários do Francês da Galera
      await client.query(`
        CREATE TABLE IF NOT EXISTS daily_votes (
          id SERIAL PRIMARY KEY,
          user_hash VARCHAR(64),
          vote_hash VARCHAR(64) UNIQUE NOT NULL,
          member_id INT REFERENCES members(id) ON DELETE CASCADE,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `)

      // Garante que a coluna user_hash exista caso a tabela já tenha sido criada anteriormente
      await client.query(`
        ALTER TABLE daily_votes ADD COLUMN IF NOT EXISTS user_hash VARCHAR(64);
      `)

      // 2. Índices para otimizar busca por hash do torcedor e hash do voto
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_daily_votes_user_hash ON daily_votes(user_hash);
        CREATE INDEX IF NOT EXISTS idx_daily_votes_hash ON daily_votes(vote_hash);
      `)

      // 3. Coluna de contagem de respeito/votos na tabela de membros
      await client.query(`
        ALTER TABLE members ADD COLUMN IF NOT EXISTS respect_count INT DEFAULT 0;
      `)

      console.log('[Database] Tabelas e colunas do Francês da Galera inicializadas com sucesso.')
    } finally {
      client.release()
    }
  } catch (err) {
    console.error('[Database] Erro ao inicializar tabelas do Francês da Galera:', err)
  }
}
