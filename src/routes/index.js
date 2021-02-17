import { Router } from 'express'

import TransferFTPController from '../controllers/TransferFTPController'

const routes = Router()
routes.use('/getFTPFile', TransferFTPController.getFTPFile)
routes.get('/', TransferFTPController.show)

export default routes
