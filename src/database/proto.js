import schema from '@/models/config/database'
import {
  ListModel
} from '@/models/index'

export default class Database {
  constructor(args) {
    const entity = args || {}
    this.router = entity.router
    this.store = entity.store
    this.created = entity.created || (() => {})
    /**
     * 有開放權限的 model
     * @type {Array<String>} 
     */
    this.auth = entity.auth || []
    /**
     * 是否初始化就去請求所有API
     * @type {Boolean} 
     */
    this.createLoad = false
    // 初始化
    this.data = {}
    Promise.all(
      Object.keys(this.data).map((key) => {
        if (this.auth.includes(key)) {
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

  async login(permission) {
    return await Promise.all(
      Object.keys(schema).map((key) => {
        try {
          if (permission[key].allow) {
            this.data[key] = this.createModel(schema[key])
            this.store.state.model[key] = this.data[key]
            if (this.createLoad) {
              return this.data[key].readList()
            }
            return Promise.resolve()
          }
        } catch (error) {
          console.log(`%cNo permission for %c${key}`, 'color: #000;', 'color: #f00;');
        }
        return Promise.resolve()
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