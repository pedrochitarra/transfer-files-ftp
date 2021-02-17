import TransferFTPService from '../services/transferFTPService'
import logger from '../shared/logger'

const remotePath = '/'
const localPath = './src/files/'
const host = '192.168.0.14'
const user = 'ftpuser'
const pass = 'ftpuser1'
const FTPService = new TransferFTPService(remotePath, localPath, host, user, pass)

class TransferFTPController {
  show (req, res) {
    res.json({
      ok: false
    })
  }

  async getFTPFile (req, res) {
    logger.warn('aquisss')
    const result = await FTPService.readData()
    logger.error(result)
    res.json(result)
  }
}

export default new TransferFTPController()
