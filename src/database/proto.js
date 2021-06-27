import schema from '@/models/config/database'
import { ListModel } from '@/models/index'

export default class Database {
  constructor(args) {
    const entity = args || {}
    this.router = entity.router
    this.store = entity.store
    this.auth = entity.auth || []
    this.created = entity.created || (() => {})
    // 初始化
    this.data = {}
    Promise.all(
      Object.keys(this.data).map((key) => {
        if (this.auth.includes(key)) {
          this.data[key] = null
          return Promise.resolve()
        } else {
          this.data[key] = new ListModel(schema[key])
          return this.data[key].readList()
        }
      })
    ).then(this.created)
  }

  async login() {
    return await Promise.all(
      Object.keys(schema).map((key) => {
        if (this.auth.includes(key)) {
          this.data[key] = new ListModel(schema[key])
          return this.data[key].readList()
        } else {
          return Promise.resolve()
        }
      })
    )
  }

  async logout() {
    Object.keys(schema).forEach((key) => {
      if (this.auth.includes(key)) {
        this.data[key] = null
      }
    })
  }
}
