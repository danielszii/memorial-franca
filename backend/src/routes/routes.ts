import { Router } from 'express'
import { EraController } from '../controllers/era.controller'
import { MemberController } from '../controllers/member.controller'

const router = Router()
const eraController = new EraController()
const memberController = new MemberController()

// Rotas
router.get('/eras', eraController.getAll)
router.get('/eras/:version', eraController.getByVersion)

router.get('/members', memberController.getAll)
router.get('/members/:id', memberController.getById)

export default router