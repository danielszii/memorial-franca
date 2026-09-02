import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import https from 'https'
import routes from './routes/routes'
import { errorHandler } from './middlewares/error.middleware'
import { LiveSyncService } from './services/live-sync.service'
import { initDatabase } from './config/database-init'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Desabilita identificação do servidor para maior segurança
app.disable('x-powered-by')

// Headers de segurança básicos
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'SAMEORIGIN')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  next()
})

app.use(express.json())

// CORS configurado para GET, POST e HEAD
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

// Rotas da API
app.use('/franca', routes)

// Middleware Global de Tratamento de Erros (sempre por último)
app.use(errorHandler)

function startSelfPing() {
  const url = process.env.RENDER_EXTERNAL_URL || 'https://memorial-franca.onrender.com'
  const INTERVAL = 10 * 60 * 1000 // 10 minutos

  if (!process.env.RENDER_EXTERNAL_URL && process.env.NODE_ENV !== 'production') {
    console.log('[Self-Ping] Ignorado em ambiente de desenvolvimento local.')
    return
  }

  console.log(`[Self-Ping] Inicializado. Pingando ${url}/franca/ping a cada 10 minutos.`)

  // Faz um ping inicial após 30 segundos da inicialização para validar
  setTimeout(() => {
    https.get(`${url}/franca/ping`, (res) => {
      console.log(`[Self-Ping] Ping inicial: status ${res.statusCode}`)
    }).on('error', (err) => {
      console.error('[Self-Ping] Erro no ping inicial:', err.message)
    })
  }, 30000)

  setInterval(() => {
    https
      .get(`${url}/franca/ping`, (res) => {
        console.log(`[Self-Ping] Resposta recebida: ${res.statusCode}`)
      })
      .on('error', (err) => {
        console.error('[Self-Ping] Erro ao realizar ping:', err.message)
      })
  }, INTERVAL)
}

app.listen(PORT, async () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
  await initDatabase()
  startSelfPing()
  // Inicia o sincronizador automático de lives (a cada 2 minutos)
  LiveSyncService.startScheduler()
})