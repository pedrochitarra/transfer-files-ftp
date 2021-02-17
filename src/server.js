import app from './app'
import logger from './shared/logger'

const server = app.listen(3333, () => {
  logger.info('Listening on port 3333')
})

process.on('SIGINT', () => {
  console.log('\n🔒 API Stopped')
  server.close()
  process.exit()
})
