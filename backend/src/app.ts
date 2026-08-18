import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import routes from './routes/routes'
import { errorHandler } from './middlewares/error.middleware'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://memorialfranca.com.br',
      'https://www.memorialfranca.com.br',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
)

// Rotas da API
app.use('/franca', routes)

// Middleware Global de Tratamento de Erros (sempre por último)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})