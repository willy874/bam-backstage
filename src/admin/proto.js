import { request } from '@/plugins/axios/request'

export default class Admin {
  constructor(args) {
    const entity = args || {}
    this.router = entity.router
    this.store = entity.store
    this.user = {
      name: 'Admin',
    }
    this.auth = []
  }

  login() {
    request.post('login')
  }

  logout() {
    request.post('logout')
  }

  getAuth(name) {
    return {}
  }
}
