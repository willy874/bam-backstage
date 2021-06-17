export default class Admin {
  constructor(args) {
    const entity = args || {}
    this.router = entity.router
    this.store = entity.store
    this.auth = []
  }

  login() {}

  logout() {}
}
