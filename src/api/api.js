import axios from 'axios'
const api = axios.create({
  baseURL: `http://${process.env.IP_ESTACAO_ANTERIOR}:${process.env.PORT_ESTACAO_ANTERIOR}/api`
})

export default api
