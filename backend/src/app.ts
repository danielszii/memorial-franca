import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import routes from './routes/routes'
import { errorHandler } from './middlewares/error.middleware'

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

// CORS configurado apenas para métodos de leitura seguros (GET, HEAD)
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

// Rotas da API (Apenas rotas GET seguras de leitura)
app.use('/franca', routes)

// Middleware Global de Tratamento de Erros (sempre por último)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})