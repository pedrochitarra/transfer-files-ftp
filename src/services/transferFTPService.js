import Jsftp from 'jsftp'
import logger from '../shared/logger'
import fs from 'fs'

class TransferService {
  constructor (remotePath, localPath, host, user, pass) {
    this.remotePath = remotePath
    this.localPath = localPath
    this.host = host
    this.user = user
    this.pass = pass
  }

  async readData () {
    // Obter as informações da pasta mais recente, que será coletado o arquivo
    /* let remotePath = await this.getFileInfo(this.remotePath)
    if (remotePath.time == 0) {
      throw Error('Não foi possível conectar ao servidor FTP')
    }
    remotePath = this.getRecentFolder(remotePath.name) */
    // Aquivo mais recente
    const recent = await this.getFileInfo(this.remotePath)
    logger.info(recent)
    if (recent.time === 0) {
      throw Error('Não foi possível conectar ao servidor FTP')
    }
    // Caminho para o arquivo no servidor FTP
    const filePath = this.remotePath + recent.name
    const nameArray = recent.name.split('.')
    // Nome do arquivo
    const fileName = nameArray[0] + '_' + new Date().getTime() + '.' + nameArray[1]
    // Caminho local para o arquivo
    const localFilePath = this.localPath + fileName
    logger.info(localFilePath)
    // Tamanho do arquivo retornado após sua transferência
    const counter = await this.transferGet(filePath, localFilePath, recent)
    return counter
  }

  async transferGet (remotePath, localPath, recent) {
    return new Promise((resolve, reject) => {
      try {
        // await this._waitFor(3000)
        // Configurações de conexão com o servidor FTP
        const Ftp = new Jsftp({
          host: this.host,
          user: this.user,
          pass: this.pass
        })

        // Caso dê erro na conexão com o servidor FTP, a função deve retornar
        Ftp.on('error', err => {
          reject(err)
        })

        let counter = 0
        // Tamanho do arquivo a ser transferido
        Ftp.getGetSocket(remotePath, function (err, socket) {
          if (err) { return logger.error(err) }
          // Cria uma stream de escrita para salvar o arquivo remoto
          const write = fs.createWriteStream(localPath)
          socket.resume()
          // Método 'on' do socket, em que cada iteração sobre "data" o buffer retornado é escrito no arquivo
          socket.on('data', function (data, error) {
            if (error) { return (error) }
            counter += data.length
            write.write(data, err => {
              if (err) { return logger.error(err) }
            })
          })
          socket.on('close', function () {
          // Encerra o processo de transferência e fecha o socket para liberar a comunicação
            logger.info('Arquivo escrito! - ' + counter + ' - bytes transferidos')
            resolve(counter)
          })
        })
      } catch (err) {
        logger.error(err)
        reject(err)
      }
    })
  }

  async getFileInfo (remotePath, job) {
  // Aguardando a conexão com o servidor FTP
    logger.info('Waiting FTP Connection...')
    // Primeira conexão com o servidor para obter o nome do arquivo mais recente
    const getRecentFileName = new Promise((resolve, reject) => {
    // Configurações de conexão
      const Ftp = new Jsftp({
        host: this.host,
        user: this.user,
        pass: this.pass
      })
      // Caso dê erro na conexão, a Promise é rejeitada
      Ftp.on('error', err => {
      // logger.error(err);
        reject(err)
      })

      let recent = {
        time: 0
      }
      // Listando os arquivos do servidor e obtendo as informações do mais recente
      Ftp.ls(remotePath, (err, res) => {
        if (err) {
          reject(err)
        } else {
          res.forEach(file => {
            logger.info(file)
            if (file.time > recent.time) {
              recent = file
            }
          })
          resolve(recent)
        }
      })
    })
    // Caso a Promise de conexão não seja executada dentro do timeout de 5s, a tentativa é interrompida para
    // garantir o fluxo do sistema
    const timeoutConexaoFTP = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('Tempo de conexão com o FTP expirado')
      }, 10000)
    })

    return Promise.race([getRecentFileName, timeoutConexaoFTP])
  }
}

export default TransferService
