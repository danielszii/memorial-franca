import { Request, Response, NextFunction } from 'express'
import { AppError } from '../errors/app.error'

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Erros operacionais conhecidos (400, 404, 401, etc.)
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      status: 'error',
      statusCode: error.statusCode,
      message: error.message,
    })
    return
  }

  // Erros inesperados ou de banco (500)
  console.error('[Unhandled Error]:', error)

  res.status(500).json({
    status: 'error',
    statusCode: 500,
    message: 'Erro interno no servidor',
  })
}