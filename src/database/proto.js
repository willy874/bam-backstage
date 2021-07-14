import schema from '@/models/config/database'
import {
  ListModel
} from '@/models/index'

export default class Database {
  constructor(args) {
    const entity = args || {}
    this.router = entity.router
    this.store = entity.store
    this.auth = entity.auth || []
    this.created = entity.created || (() => {})
    this.allow = true
    this.createLoad = false
    // 初始化
    this.data = {}
    Promise.all(
      Object.keys(this.data).map((key) => {
        if (this.auth.includes(key) || this.allow) {
          this.data[key] = null
          return Promise.resolve()
        } else {
          this.data[key] = this.createModel(schema[key])
          this.store.state.model[key] = this.data[key]
          if (this.createLoad) {
            return this.data[key].readList()
          }
          return Promise.resolve()
        }
      })
    ).then(this.created)
  }

  createModel(schema) {
    const Model = schema.listModel || ListModel
    return new Model(schema)
  }

  async login() {
    return await Promise.all(
      Object.keys(schema).map((key) => {
        if (this.auth.includes(key) || this.allow) {
          this.data[key] = this.createModel(schema[key])
          this.store.state.model[key] = this.data[key]
          if (this.createLoad) {
            return this.data[key].readList()
          }
          return Promise.resolve()
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