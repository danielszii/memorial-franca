import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()



const isProduction = process.env.NODE_ENV === 'production'

// Em produção, valida que as credenciais obrigatórias estão configuradas para evitar brechas de segurança
if (isProduction) {
  if (!process.env.DATABASE_URL && (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME)) {
    throw new Error(
      '[Security Alert] Faltando variáveis de ambiente obrigatórias para o banco de dados em produção (DATABASE_URL ou DB_HOST/DB_USER/DB_PASSWORD/DB_NAME).'
    )
  }
}

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'franca_db',
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

pool.on('connect', () => {
  console.log('[Database] Conexão com PostgreSQL estabelecida com sucesso.')
})

pool.on('error', (err) => {
  console.error('[Database] Erro inesperado no pool de conexões:', err)
  process.exit(-1)
})

export default pool