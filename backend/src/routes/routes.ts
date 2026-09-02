import { Router } from 'express'
import { EraController } from '../controllers/era.controller'
import { MemberController } from '../controllers/member.controller'
import { PresenceController } from '../controllers/presence.controller'

const router = Router()
const eraController = new EraController()
const memberController = new MemberController()
const presenceController = new PresenceController()

// Rotas
router.get('/ping', (_req, res) => {
  res.status(200).send('pong')
})

router.get('/eras', eraController.getAll)
router.get('/eras/:version', eraController.getByVersion)

router.get('/members', memberController.getAll)
router.get('/members/:id', memberController.getById)

// Sincronização manual/webhook de lives
router.get('/sync-lives', memberController.syncLives)

// Presença em tempo real (visitantes online)
router.get('/online', presenceController.getOnline)

export default router